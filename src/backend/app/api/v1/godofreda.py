"""
Endpoints para controle da Godofreda
"""

from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from pydantic import BaseModel

from app.services.godofreda_service import godofreda_service


router = APIRouter(prefix="/godofreda", tags=["Godofreda"])

class MessageRequest(BaseModel):
    message: str
    user_id: str = None

class ToggleRequest(BaseModel):
    enabled: bool

@router.get("/status")
async def get_godofreda_status():
    """Obtém o status da Godofreda"""
    return await godofreda_service.get_status()

@router.post("/chat")
async def send_message_to_godofreda(
    request: MessageRequest
):
    """Envia mensagem para a Godofreda"""
    try:
        result = await godofreda_service.send_message(
            message=request.message,
            user_id=request.user_id or "default_user"
        )
        return result
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

@router.post("/toggle")
async def toggle_godofreda(
    request: ToggleRequest
):
    """Ativa/desativa o módulo Godofreda"""

    
    try:
        result = await godofreda_service.toggle_module(request.enabled)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao alterar status: {str(e)}")

@router.get("/health")
async def godofreda_health():
    """Verifica a saúde da Godofreda"""
    available = await godofreda_service.is_available()
    return {
        "status": "healthy" if available else "unhealthy",
        "available": available,
        "enabled": godofreda_service.is_enabled
    }

@router.post("/test-connection")
async def test_godofreda_connection():
    """Testa a conexão com a Godofreda"""
    try:
        result = await godofreda_service.test_connection()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao testar conexão: {str(e)}") 