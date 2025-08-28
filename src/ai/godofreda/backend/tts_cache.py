# ================================
# GODOFREDA TTS CACHE SERVICE
# ================================
# Cache Redis otimizado para TTS com compressão e TTL inteligente
# ================================

import hashlib
import json
import logging
import pickle
import zlib
from typing import Optional, Dict, Any, Tuple
import redis.asyncio as redis
from config import config

logger = logging.getLogger(__name__)

class TTSCache:
    """Cache Redis otimizado para TTS"""
    
    def __init__(self):
        self.redis_client: redis.Redis = None
        self.compression_threshold = 1024  # Comprimir arquivos > 1KB
        self._connect_redis()
    
    def _connect_redis(self) -> None:
        """Conecta ao Redis"""
        try:
            redis_url = config.redis_url if hasattr(config, 'redis_url') else "redis://redis:6379"
            self.redis_client = redis.from_url(redis_url, decode_responses=False)
            logger.info("TTS Cache Redis conectado com sucesso")
        except Exception as e:
            logger.warning(f"Falha ao conectar TTS Cache Redis: {e}")
            self.redis_client = None
    
    def _generate_cache_key(self, text: str, voice_config: Dict[str, Any]) -> str:
        """Gera chave única para cache baseada no texto e configuração"""
        # Criar hash do texto e configuração
        config_str = json.dumps(voice_config, sort_keys=True)
        content_hash = hashlib.md5(f"{text}:{config_str}".encode()).hexdigest()
        return f"tts:audio:{content_hash}"
    
    def _compress_data(self, data: bytes) -> Tuple[bytes, bool]:
        """Comprime dados se necessário"""
        if len(data) > self.compression_threshold:
            try:
                compressed = zlib.compress(data, level=6)
                if len(compressed) < len(data):
                    return compressed, True
            except Exception as e:
                logger.warning(f"Erro na compressão: {e}")
        return data, False
    
    def _decompress_data(self, data: bytes, compressed: bool) -> bytes:
        """Descomprime dados se necessário"""
        if compressed:
            try:
                return zlib.decompress(data)
            except Exception as e:
                logger.error(f"Erro na descompressão: {e}")
                return data
        return data
    
    async def get_cached_audio(self, text: str, voice_config: Dict[str, Any]) -> Optional[bytes]:
        """
        Obtém áudio do cache
        
        Args:
            text: Texto para síntese
            voice_config: Configuração da voz
            
        Returns:
            Dados do áudio ou None se não encontrado
        """
        if not self.redis_client:
            return None
        
        try:
            cache_key = self._generate_cache_key(text, voice_config)
            cached_data = await self.redis_client.get(cache_key)
            
            if cached_data:
                # Deserializar dados
                cache_info = pickle.loads(cached_data)
                audio_data = cache_info['audio']
                compressed = cache_info.get('compressed', False)
                
                # Descomprimir se necessário
                audio_data = self._decompress_data(audio_data, compressed)
                
                logger.debug(f"Cache hit para texto: {text[:50]}...")
                return audio_data
            
            logger.debug(f"Cache miss para texto: {text[:50]}...")
            return None
            
        except Exception as e:
            logger.error(f"Erro ao obter cache TTS: {e}")
            return None
    
    async def cache_audio(self, text: str, voice_config: Dict[str, Any], 
                         audio_data: bytes, ttl: int = 3600) -> bool:
        """
        Cacheia áudio no Redis
        
        Args:
            text: Texto sintetizado
            voice_config: Configuração da voz
            audio_data: Dados do áudio
            ttl: Tempo de vida em segundos
            
        Returns:
            True se cacheado com sucesso
        """
        if not self.redis_client:
            return False
        
        try:
            cache_key = self._generate_cache_key(text, voice_config)
            
            # Comprimir dados se necessário
            compressed_data, is_compressed = self._compress_data(audio_data)
            
            # Criar objeto de cache
            cache_info = {
                'audio': compressed_data,
                'compressed': is_compressed,
                'text_length': len(text),
                'audio_size': len(audio_data),
                'compressed_size': len(compressed_data),
                'voice_config': voice_config,
                'created_at': time.time()
            }
            
            # Serializar e cachear
            serialized_data = pickle.dumps(cache_info)
            await self.redis_client.setex(cache_key, ttl, serialized_data)
            
            compression_ratio = len(compressed_data) / len(audio_data) if len(audio_data) > 0 else 1
            logger.debug(f"Áudio cacheado: {len(audio_data)} bytes -> {len(compressed_data)} bytes "
                        f"(compressão: {compression_ratio:.2f})")
            
            return True
            
        except Exception as e:
            logger.error(f"Erro ao cachear áudio TTS: {e}")
            return False
    
    async def get_cache_stats(self) -> Dict[str, Any]:
        """Retorna estatísticas do cache TTS"""
        if not self.redis_client:
            return {"status": "disconnected"}
        
        try:
            # Obter todas as chaves TTS
            tts_keys = await self.redis_client.keys("tts:audio:*")
            
            total_size = 0
            total_compressed_size = 0
            compression_ratios = []
            
            for key in tts_keys[:100]:  # Limitar a 100 chaves para performance
                try:
                    cached_data = await self.redis_client.get(key)
                    if cached_data:
                        cache_info = pickle.loads(cached_data)
                        total_size += cache_info.get('audio_size', 0)
                        total_compressed_size += cache_info.get('compressed_size', 0)
                        
                        if cache_info.get('audio_size', 0) > 0:
                            ratio = cache_info.get('compressed_size', 0) / cache_info.get('audio_size', 0)
                            compression_ratios.append(ratio)
                except Exception as e:
                    logger.debug(f"Erro ao processar chave {key}: {e}")
            
            avg_compression = sum(compression_ratios) / len(compression_ratios) if compression_ratios else 1
            
            return {
                "status": "connected",
                "total_keys": len(tts_keys),
                "total_size_mb": total_size / 1024 / 1024,
                "compressed_size_mb": total_compressed_size / 1024 / 1024,
                "compression_ratio": avg_compression,
                "space_saved_mb": (total_size - total_compressed_size) / 1024 / 1024
            }
            
        except Exception as e:
            logger.error(f"Erro ao obter estatísticas do cache: {e}")
            return {"status": "error", "error": str(e)}
    
    async def clear_cache(self, pattern: str = "tts:audio:*") -> bool:
        """
        Limpa cache TTS
        
        Args:
            pattern: Padrão de chaves para limpar
            
        Returns:
            True se limpeza bem-sucedida
        """
        if not self.redis_client:
            return False
        
        try:
            keys = await self.redis_client.keys(pattern)
            if keys:
                await self.redis_client.delete(*keys)
                logger.info(f"Cache TTS limpo: {len(keys)} chaves removidas")
            return True
            
        except Exception as e:
            logger.error(f"Erro ao limpar cache TTS: {e}")
            return False
    
    async def cleanup_expired(self) -> int:
        """
        Remove entradas expiradas do cache
        
        Returns:
            Número de entradas removidas
        """
        if not self.redis_client:
            return 0
        
        try:
            # Redis remove automaticamente entradas expiradas
            # Este método pode ser usado para limpeza manual se necessário
            return 0
            
        except Exception as e:
            logger.error(f"Erro na limpeza de cache expirado: {e}")
            return 0

# Instância global do cache TTS
tts_cache = TTSCache() 