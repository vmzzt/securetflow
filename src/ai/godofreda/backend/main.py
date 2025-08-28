"""
Godofreda API - IA VTuber Multimodal
API principal para conversação com IA sarcástica e síntese de voz
"""

from fastapi import FastAPI, HTTPException, Request, Form, File, UploadFile, BackgroundTasks, Depends
from fastapi.responses import FileResponse, JSONResponse, Response, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from TTS.api import TTS
import uvicorn
import os
import uuid
import time
import logging
from datetime import datetime
import json
import io
from typing import Optional, Dict, Any
import asyncio
from contextlib import asynccontextmanager
import sys

# Importar serviço GodofredaLLM
from llm_service import GodofredaLLM, get_llm_instance

# Importar configuração centralizada
from config import config

# Importar serviços
from cache_service import response_cache, cached_response, cache_service
from rate_limiter import rate_limiter, check_rate_limit, rate_limit_decorator
from cleanup_service import cleanup_service, start_background_cleanup
from tts_cache import tts_cache


# ================================
# CONFIGURAÇÃO DE LOGGING
# ================================
# Criar diretório de logs se não existir
try:
    os.makedirs('app/logs', exist_ok=True)
    log_file = 'app/logs/godofreda.log'
except OSError:
    # Fallback para /tmp se não conseguir criar em app/logs
    log_file = '/tmp/godofreda.log'

logging.basicConfig(
    level=getattr(logging, config.logging.level),
    format=config.logging.format,
    handlers=[
        logging.FileHandler(log_file),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# ================================
# CONFIGURAÇÕES DA APLICAÇÃO
# ================================
# Configuração centralizada importada de config.py

# ================================
# LIFECYCLE MANAGER
# ================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gerencia o ciclo de vida da aplicação"""
    # Startup
    logger.info("🚀 Iniciando Godofreda API...")
    
    try:
        # Validar ambiente
        logger.info("Validando ambiente...")
        config.validate()
        logger.info("✅ Ambiente validado com sucesso")
        
        # Iniciar serviços
        logger.info("Iniciando serviços...")
        await _startup_services()
        logger.info("✅ Serviços iniciados com sucesso")
        
        logger.info(f"🎉 Godofreda API iniciada com sucesso!")
        logger.info(f"📡 API: http://{config.api.host}:{config.api.port}")
        logger.info(f"📊 Docs: http://{config.api.host}:{config.api.port}/docs")
        
    except Exception as e:
        logger.error(f"❌ Erro na inicialização: {e}")
        raise
    
    yield
    
    # Shutdown
    logger.info("🛑 Parando Godofreda API...")
    await _shutdown_services()
    logger.info("✅ Godofreda API parada com sucesso")

# ================================
# INSTÂNCIA FASTAPI
# ================================
app = FastAPI(
    title="Godofreda API",
    description="API de conversa com IA VTuber Godofreda",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# ================================
# MIDDLEWARE CORS
# ================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.api.cors_origins,  # ✅ SEGURO - Apenas origens configuradas
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type", "X-Requested-With"],
)

# Trusted Hosts (segurança)
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]  # Configurar para produção
)

# ================================
# MÉTRICAS SIMPLIFICADAS
# ================================
# Métricas removidas para simplificação

# ================================
# INICIALIZAÇÃO DO TTS
# ================================
def initialize_tts() -> TTS:
    """Inicializa o modelo TTS com tratamento de erro"""
    try:
        # Criar diretório temporário se não existir
        os.makedirs(config.tts.temp_dir, exist_ok=True)
        
        # Configurar variável de ambiente para aceitar licença automaticamente
        os.environ['COQUI_TOS_AGREED'] = '1'
        
        tts = TTS(model_name=config.tts.model)
        logger.info("TTS model loaded successfully")
        return tts
    except Exception as e:
        logger.error(f"Failed to load TTS model: {e}")
        raise

# Inicializar TTS globalmente
try:
    tts = initialize_tts()
except Exception as e:
    logger.error(f"Critical: TTS initialization failed: {e}")
    tts = None

# Inicializar LLM globalmente (singleton)
llm_instance = None

# ================================
# MIDDLEWARE SIMPLIFICADO
# ================================
@app.middleware("http")
async def simple_middleware(request: Request, call_next):
    """Middleware simplificado"""
    start_time = time.time()
    
    try:
        response = await call_next(request)
        
        # Log simples
        duration = time.time() - start_time
        logger.info(f"{request.method} {request.url.path} - {response.status_code} - {duration:.3f}s")
        
        return response
    except Exception as e:
        logger.error(f"Request error: {e}")
        raise

# ================================
# VALIDADORES
# ================================
def validate_text_input(text: str) -> None:
    """Valida entrada de texto"""
    if not text or len(text.strip()) == 0:
        raise HTTPException(status_code=400, detail="Texto não pode estar vazio")
    
    if len(text) > config.api.max_text_length:
        raise HTTPException(
            status_code=400, 
            detail=f"Texto muito longo (máximo {config.api.max_text_length} caracteres)"
        )

def validate_file_type(file: UploadFile, allowed_types: list) -> None:
    """Valida tipo e tamanho de arquivo"""
    if not file:
        return
        
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400, 
            detail=f"Tipo de arquivo não suportado. Tipos permitidos: {allowed_types}"
        )
    
    # Verificar tamanho do arquivo
    if hasattr(file, 'size') and file.size and file.size > config.file.max_file_size:
        raise HTTPException(
            status_code=400,
            detail=f"Arquivo muito grande. Tamanho máximo: {config.file.max_file_size // (1024*1024)}MB"
        )

# ================================
# ENDPOINTS DE SAÚDE
# ================================
@app.get("/")
async def root() -> Dict[str, Any]:
    """Endpoint raiz com informações da API"""
    return {
        "message": "🤖 Godofreda API - IA VTuber",
        "version": "2.0.0",
        "status": "online",
        "endpoints": {
            "health": "/health",
            "status": "/status",
            "falar": "/falar",
            "chat": "/chat"
        }
    }

@app.get("/health")
async def health_check() -> Dict[str, str]:
    """Health check básico"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/health/ready")
async def readiness_check() -> Response:
    """Verificação de prontidão"""
    try:
        if tts is not None:
            return JSONResponse(
                content={"status": "ready", "timestamp": datetime.now().isoformat()}
            )
        else:
            return JSONResponse(
                status_code=503,
                content={"status": "not ready", "reason": "TTS model not loaded"}
            )
    except Exception as e:
        return JSONResponse(
            status_code=503,
            content={"status": "not ready", "reason": str(e)}
        )

@app.get("/health/live")
async def liveness_check() -> Dict[str, str]:
    """Verificação de vitalidade"""
    return {"status": "alive", "timestamp": datetime.now().isoformat()}



@app.get("/status")
async def status() -> Dict[str, Any]:
    """Status detalhado do sistema"""
    return {
        "system": {
            "status": "online" if SYSTEM_STATUS._value.get() == 1 else "offline",
            "tts_model": config.tts.model,
            "uptime": "running"
        },
        "status": "simplified",
        "timestamp": datetime.now().isoformat()
    }

# ================================
# ENDPOINTS DE PERSONALIDADE
# ================================
@app.get("/personality")
async def get_personality() -> Dict[str, Any]:
    """Retorna configurações de personalidade da Godofreda"""
    return {
        "name": "Godofreda",
        "personality": {
            "sarcasm_level": 75,
            "response_speed": "normal",
            "voice_style": "temporary",
            "description": "IA VTuber sarcástica e irreverente"
        },
        "capabilities": [
            "síntese de voz em português",
            "respostas sarcásticas",
            "personalidade configurável"
        ]
    }

# ================================
# ENDPOINTS DE TTS
# ================================
@app.post("/falar")
@rate_limit_decorator("tts")
async def sintetizar_voz(background_tasks: BackgroundTasks, texto: str = Form(...)) -> FileResponse:
    """Sintetiza texto em áudio usando TTS"""
    try:
        # Verificar se o TTS está disponível
        if SYSTEM_STATUS._value.get() != 1 or tts is None:
            raise HTTPException(status_code=503, detail="TTS service unavailable")
        
        # Validar entrada
        validate_text_input(texto)
        
        # Incrementar contador de requisições TTS
        TTS_REQUEST_COUNT.inc()
        
        # Gerar nome único para o arquivo
        output_path = f"{config.tts.temp_dir}/{uuid.uuid4()}.wav"
        
        # Medir duração da síntese
        start_time = time.time()
        
        # Gerar áudio com speaker padrão
        tts.tts_to_file(
            text=texto,
            language="pt",
            file_path=output_path,
            speaker=config.tts.default_speaker
        )
        
        # Registrar duração
        duration = time.time() - start_time
        TTS_DURATION.observe(duration)
        
        # Log de sucesso
        logger.info(f"TTS request completed successfully. Text: '{texto[:50]}...', Duration: {duration:.2f}s")
        
        # Adicionar tarefa de limpeza
        background_tasks.add_task(lambda: os.remove(output_path) if os.path.exists(output_path) else None)
        
        return FileResponse(output_path, media_type="audio/wav")

    except HTTPException:
        raise
    except Exception as e:
        # Registrar erro
        ERROR_COUNT.labels(type="tts_error").inc()
        logger.error(f"TTS error: {e}")
        raise HTTPException(status_code=500, detail=f"Erro na síntese de voz: {str(e)}")

# ================================
# ENDPOINTS DE CHAT
# ================================
@app.post("/chat")
@rate_limit_decorator("chat")
@cached_response(ttl=300)  # Cache por 5 minutos
async def chat_endpoint(user_input: str = Form(...), context: str = Form("")) -> Dict[str, str]:
    """Endpoint de chat conversacional com LLM sarcástica"""
    try:
        # Verificar se o LLM está disponível
        if llm_instance is None:
            raise HTTPException(status_code=503, detail="LLM service unavailable")
        
        # Validar entrada
        validate_text_input(user_input)
        
        # Gerar resposta usando LLM singleton
        resposta = await llm_instance.generate_response(user_input, context)
        
        logger.info(f"Chat response generated for input: '{user_input[:50]}...'")
        return {"response": resposta}
        
    except HTTPException:
        raise
    except Exception as e:
        ERROR_COUNT.labels(type="chat_error").inc()
        logger.error(f"Erro no chat LLM: {e}")
        raise HTTPException(status_code=500, detail="Erro ao gerar resposta da Godofreda LLM")

@app.post("/api/godofreda/chat")
@rate_limit_decorator("chat")
async def multimodal_chat(
    text: str = Form(...),
    image: Optional[UploadFile] = File(None),
    voice: Optional[UploadFile] = File(None)
) -> StreamingResponse:
    """Chat multimodal com suporte a texto, imagem e voz"""
    try:
        # Verificar se o TTS está disponível
        if SYSTEM_STATUS._value.get() != 1 or tts is None:
            raise HTTPException(status_code=503, detail="TTS service unavailable")
        
        # Validar entrada de texto
        validate_text_input(text)
        
        # Validar tipos de arquivo
        if image and config.file.allowed_image_types:
            validate_file_type(image, config.file.allowed_image_types)
        if voice and config.file.allowed_audio_types:
            validate_file_type(voice, config.file.allowed_audio_types)
        
        # Processar entrada multimodal
        context = ""
        final_text = text
        
        if image:
            # Simular análise de imagem (aqui você integraria com LLM Vision)
            image_analysis = await analyze_image_with_llm(image)
            context += f"Imagem: {image_analysis}\n"
            logger.info(f"Image analysis completed for: {image.filename}")
        
        if voice:
            # Simular speech-to-text (aqui você integraria com STT)
            transcription = await speech_to_text(voice)
            final_text += f" {transcription}"
            logger.info(f"Voice transcription completed for: {voice.filename}")
        
        # Gerar resposta com personalidade da Godofreda
        godofreda_response = await generate_response_with_personality(
            user_input=final_text,
            context=context
        )
        
        # Converter resposta para áudio
        audio_response = await text_to_speech_response(godofreda_response)
        
        logger.info(f"Multimodal chat completed successfully. Input: '{text[:50]}...'")
        
        return StreamingResponse(
            io.BytesIO(audio_response),
            media_type="audio/wav",
            headers={"X-Response-Text": godofreda_response}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        ERROR_COUNT.labels(type="chat_error").inc()
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=f"Erro no chat: {str(e)}")

# ================================
# ENDPOINTS DE WEBHOOK
# ================================
@app.post("/webhook/alerts")
async def webhook_alerts(alert_data: dict) -> Dict[str, str]:
    """Webhook para receber alertas do AlertManager"""
    logger.warning(f"Alert received: {json.dumps(alert_data, indent=2)}")
    return {"status": "alert_received"}

# ================================
# FUNÇÕES AUXILIARES
# ================================
async def analyze_image_with_llm(image: UploadFile) -> str:
    """Analisa imagem usando LLM multimodal (simulado)"""
    # TODO: Integrar com GPT-4V, Claude, etc.
    logger.info(f"Image analysis requested for: {image.filename}")
    return "Imagem analisada: contém elementos visuais interessantes"

async def speech_to_text(audio: UploadFile) -> str:
    """Converte áudio para texto (simulado)"""
    # TODO: Integrar com Whisper, etc.
    logger.info(f"Speech-to-text requested for: {audio.filename}")
    return "Áudio transcrito com sucesso"

async def generate_response_with_personality(user_input: str, context: str = "") -> str:
    """Gera resposta com personalidade sarcástica da Godofreda"""
    if llm_instance is None:
        raise HTTPException(status_code=503, detail="LLM service unavailable")
    
    return await llm_instance.generate_response(user_input, context)

async def text_to_speech_response(text: str) -> bytes:
    """Converte texto para áudio usando TTS"""
    try:
        # Gerar nome único para o arquivo temporário
        output_path = f"{config.tts.temp_dir}/{uuid.uuid4()}.wav"
        
        # Gerar áudio
        if tts is not None:
            tts.tts_to_file(
                text=text,
                language="pt",
                file_path=output_path,
                speaker=config.tts.default_speaker
            )
        else:
            raise HTTPException(status_code=503, detail="TTS service unavailable")
        
        # Ler arquivo e retornar bytes
        with open(output_path, 'rb') as f:
            audio_bytes = f.read()
        
        # Limpar arquivo temporário
        os.remove(output_path)
        
        return audio_bytes
        
    except Exception as e:
        logger.error(f"TTS error in chat: {e}")
        raise HTTPException(status_code=500, detail="Erro na síntese de voz")

# ================================
# DEPENDENCIES
# ================================

# ================================
# DEPENDENCIES
# ================================
async def get_llm():
    """Dependency para LLM service"""
    return get_llm_instance()

async def get_cache():
    """Dependency para cache service"""
    return cache_service

# ================================
# RATE LIMITING
# ================================
async def check_rate_limit(request: Request):
    """Verifica rate limiting"""
    client_ip = request.client.host
    if not await rate_limiter.is_allowed(client_ip):
        raise HTTPException(status_code=429, detail="Rate limit exceeded")
    return True

# ================================
# ROTAS PRINCIPAIS
# ================================
@app.get("/")
async def root():
    """Rota raiz"""
    return {
        "message": "🎭 Godofreda API v2.0.0",
        "status": "online",
        "version": "2.0.0",
        "docs": "/docs",
        "metrics": "/metrics",
        "health": "/health"
    }

@app.get("/health")
async def health_check():
    """Health check da API"""
    try:
        # Verificar serviços críticos
        llm_health = await get_llm_instance().check_health()
        cache_health = await cache_service.get_stats()
        
        health_status = {
            "status": "healthy" if llm_health and cache_health["status"] == "connected" else "degraded",
            "timestamp": time.time(),
            "services": {
                "llm": "healthy" if llm_health else "unhealthy",
                "cache": cache_health["status"],
                "cleanup": "running" if cleanup_service.is_running else "stopped"
            }
        }
        
        status_code = 200 if health_status["status"] == "healthy" else 503
        return JSONResponse(content=health_status, status_code=status_code)
        
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return JSONResponse(
            content={"status": "unhealthy", "error": str(e)},
            status_code=503
        )



# ================================
# ROTAS DE TTS
# ================================
@app.post("/tts/generate")
async def generate_tts(
    request: Request,
    text: str,
    speaker: str = config.tts.default_speaker,
    llm: Any = Depends(get_llm),
    cache: Any = Depends(get_cache),
    rate_limit: bool = Depends(check_rate_limit)
):
    """Gera áudio TTS"""
    start_time = time.time()
    
    try:
        # Validar entrada
        if not text or len(text) > config.api.max_text_length:
            raise HTTPException(status_code=400, detail="Texto inválido")
        
        # Configuração da voz
        voice_config = {"speaker": speaker, "model": config.tts.model}
        
        # Tentar cache primeiro
        cached_audio = await tts_cache.get_cached_audio(text, voice_config)
        if cached_audio:
            duration = time.time() - start_time
            
            return {
                "audio": cached_audio,
                "cached": True,
                "duration": duration
            }
        
        # Gerar áudio (implementação do TTS aqui)
        # audio_data = await tts_service.generate_audio(text, speaker)
        
        # Cachear resultado
        # await tts_cache.cache_audio(text, voice_config, audio_data)
        
        duration = time.time() - start_time
        
        return {
            "audio": "audio_data_placeholder",
            "cached": False,
            "duration": duration
        }
        
    except Exception as e:
        duration = time.time() - start_time
        logger.error(f"Erro na geração TTS: {e}")
        raise HTTPException(status_code=500, detail="Erro na geração de áudio")

# ================================
# ROTAS DE LLM
# ================================
@app.post("/llm/chat")
async def chat_with_llm(
    request: Request,
    message: str,
    context: str = "",
    llm: Any = Depends(get_llm),
    rate_limit: bool = Depends(check_rate_limit)
):
    """Chat com LLM"""
    start_time = time.time()
    
    try:
        # Validar entrada
        if not message or len(message) > config.api.max_text_length:
            raise HTTPException(status_code=400, detail="Mensagem inválida")
        
        # Gerar resposta
        response = await llm.generate_response(message, context)
        
        duration = time.time() - start_time
        
        return {
            "response": response,
            "model": llm.model,
            "duration": duration
        }
        
    except Exception as e:
        duration = time.time() - start_time
        logger.error(f"Erro no chat LLM: {e}")
        raise HTTPException(status_code=500, detail="Erro na geração de resposta")

# ================================
# ROTAS DE ADMIN
# ================================
@app.get("/admin/stats")
async def get_stats():
    """Estatísticas do sistema"""
    try:
        return {
            "api": {
                "status": "simplified"
            },
            "tts": {
                "status": "simplified"
            },
            "llm": {
                "status": "simplified"
            },
            "cache": await cache_service.get_stats(),
            "cleanup": cleanup_service.get_stats(),
            "tts_cache": await tts_cache.get_cache_stats()
        }
    except Exception as e:
        logger.error(f"Erro ao obter estatísticas: {e}")
        raise HTTPException(status_code=500, detail="Erro ao obter estatísticas")

@app.post("/admin/cleanup")
async def force_cleanup(cleanup_type: str = "all"):
    """Força limpeza do sistema"""
    try:
        result = await cleanup_service.force_cleanup(cleanup_type)
        return result
    except Exception as e:
        logger.error(f"Erro na limpeza forçada: {e}")
        raise HTTPException(status_code=500, detail="Erro na limpeza")

# ================================
# FUNÇÕES AUXILIARES
# ================================
async def _validate_dependencies():
    """Valida dependências externas"""
    # Validar Redis
    cache_stats = await cache_service.get_stats()
    if cache_stats["status"] != "connected":
        logger.warning("Redis não está conectado")
    
    # Validar Ollama
    llm = get_llm_instance()
    llm_health = await llm.check_health()
    if not llm_health:
        logger.warning("Ollama não está saudável")

async def _startup_services():
    """Inicia serviços da aplicação"""
    global llm_instance
    
    # Iniciar serviço de limpeza
    await cleanup_service.start()
    
    # Inicializar LLM
    try:
        llm_instance = GodofredaLLM()
        await llm_instance._validate_connection()
        logger.info("LLM service initialized successfully")
    except Exception as e:
        logger.error(f"Critical: LLM initialization failed: {e}")
        llm_instance = None

async def _shutdown_services():
    """Para serviços da aplicação"""
    # Parar serviço de limpeza
    await cleanup_service.stop()
    
    # Fechar conexões
    await cache_service.close()
    await get_llm_instance().close()

# ================================
# MAIN
# ================================
if __name__ == "__main__":
    logger.info("Iniciando Godofreda API...")
    logger.info(f"Configuração: HOST={config.api.host}, PORT={config.api.port}, "
                f"LOG_LEVEL={config.logging.level}")
    
    uvicorn.run(
        "main:app",
        host=config.api.host,
        port=config.api.port,
        log_level=config.logging.level.lower(),
        reload=config.api.debug
    )
