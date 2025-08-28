"""
Serviço de integração com Godofreda
Permite ativar/desativar e comunicar com o módulo Godofreda
"""

import httpx
import asyncio
import os
from typing import Optional, Dict, Any
from fastapi import HTTPException
from contextlib import asynccontextmanager

class GodofredaService:
    """Serviço para integração com Godofreda"""
    
    def __init__(self):
        self.client = httpx.AsyncClient(timeout=30.0)
        self._enabled = os.getenv("GODOFREDA_ENABLED", "true").lower() == "true"
        self._host = os.getenv("GODOFREDA_HOST", "localhost")
        self._port = int(os.getenv("GODOFREDA_PORT", "8001"))
        self._api_key = os.getenv("GODOFREDA_API_KEY", "")
        self._llm_model = os.getenv("GODOFREDA_LLM_MODEL", "llama3.2:3b")
        self._tts_enabled = os.getenv("GODOFREDA_TTS_ENABLED", "true").lower() == "true"
    
    @property
    def is_enabled(self) -> bool:
        """Verifica se o módulo está habilitado"""
        return self._enabled
    
    @property
    def base_url(self) -> str:
        """Retorna a URL base da API"""
        return f"http://{self._host}:{self._port}"
    
    def get_headers(self) -> dict:
        """Retorna headers para autenticação"""
        headers = {"Content-Type": "application/json"}
        if self._api_key:
            headers["Authorization"] = f"Bearer {self._api_key}"
        return headers
    
    async def is_available(self) -> bool:
        """Verifica se a Godofreda está disponível"""
        if not self.is_enabled:
            return False
            
        try:
            response = await self.client.get(f"{self.base_url}/health", timeout=5.0)
            return response.status_code == 200
        except (httpx.RequestError, httpx.TimeoutException, Exception):
            return False
    
    async def send_message(self, message: str, user_id: str = None) -> Dict[str, Any]:
        """Envia mensagem para a Godofreda"""
        if not self.is_enabled:
            raise HTTPException(status_code=503, detail="Godofreda não está habilitada")
        
        if not await self.is_available():
            raise HTTPException(status_code=503, detail="Godofreda não está disponível")
        
        try:
            payload = {
                "message": message,
                "user_id": user_id,
                "context": "securet_flow"
            }
            
            response = await self.client.post(
                f"{self.base_url}/chat",
                json=payload,
                headers=self.get_headers(),
                timeout=30.0
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                error_detail = "Erro na comunicação com Godofreda"
                try:
                    error_data = response.json()
                    error_detail = error_data.get("detail", error_detail)
                except:
                    pass
                raise HTTPException(status_code=response.status_code, detail=error_detail)
                
        except httpx.TimeoutException:
            raise HTTPException(status_code=503, detail="Timeout na comunicação com Godofreda")
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"Erro de conexão com Godofreda: {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")
    
    async def get_status(self) -> Dict[str, Any]:
        """Obtém status da Godofreda"""
        available = await self.is_available()
        return {
            "enabled": self.is_enabled,
            "available": available,
            "host": self._host,
            "port": self._port,
            "llm_model": self._llm_model,
            "tts_enabled": self._tts_enabled,
            "base_url": self.base_url,
            "status": "online" if available else "offline"
        }
    
    async def toggle_module(self, enabled: bool) -> Dict[str, Any]:
        """Ativa/desativa o módulo Godofreda"""
        try:
            # Atualiza a configuração em memória
            self._enabled = enabled
            
            # Em produção, você pode querer persistir essa configuração
            # Por exemplo, atualizando um arquivo de configuração ou banco de dados
            
            # Verifica se a mudança foi aplicada
            if enabled and not await self.is_available():
                return {
                    "enabled": enabled,
                    "success": False,
                    "message": "Godofreda ativada mas não está disponível. Verifique se o serviço está rodando."
                }
            
            return {
                "enabled": enabled,
                "success": True,
                "message": f"Godofreda {'ativada' if enabled else 'desativada'} com sucesso",
                "available": await self.is_available() if enabled else False
            }
        except Exception as e:
            return {
                "enabled": self.is_enabled,
                "success": False,
                "message": f"Erro ao alterar status: {str(e)}"
            }
    
    async def test_connection(self) -> Dict[str, Any]:
        """Testa a conexão com a Godofreda"""
        try:
            response = await self.client.get(f"{self.base_url}/health", timeout=5.0)
            if response.status_code == 200:
                return {
                    "success": True,
                    "message": "Conexão com Godofreda estabelecida com sucesso",
                    "response_time": response.elapsed.total_seconds()
                }
            else:
                return {
                    "success": False,
                    "message": f"Godofreda respondeu com status {response.status_code}"
                }
        except httpx.TimeoutException:
            return {
                "success": False,
                "message": "Timeout ao conectar com Godofreda"
            }
        except httpx.RequestError as e:
            return {
                "success": False,
                "message": f"Erro de conexão: {str(e)}"
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Erro inesperado: {str(e)}"
            }
    
    @asynccontextmanager
    async def get_client(self):
        """Context manager para o cliente HTTP"""
        try:
            yield self.client
        finally:
            await self.client.aclose()
    
    async def close(self):
        """Fecha o cliente HTTP"""
        await self.client.aclose()

# Instância global do serviço
godofreda_service = GodofredaService() 