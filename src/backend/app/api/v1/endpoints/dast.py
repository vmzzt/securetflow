from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, HttpUrl
from typing import Optional

from app.core.auth import get_current_user
from app.core.security import require_permission
from app.models.user import User
from app.services.dast_service import dast_service

router = APIRouter()

class DASTSubmitRequest(BaseModel):
    target: HttpUrl
    tool: str = "zap"  # zap | nuclei | both

class DASTSubmitResponse(BaseModel):
    job_id: str
    status: str

@router.post("/submit", response_model=DASTSubmitResponse)
@require_permission("write:scans")
async def dast_submit(req: DASTSubmitRequest, current_user: User = Depends(get_current_user)):
    job_id = await dast_service.submit(str(req.target), req.tool)
    return DASTSubmitResponse(job_id=job_id, status="queued")

@router.get("/status/{job_id}")
@require_permission("read:scans")
async def dast_status(job_id: str, current_user: User = Depends(get_current_user)):
    data = await dast_service.status(job_id)
    if not data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job não encontrado")
    return data

@router.post("/cancel/{job_id}")
@require_permission("write:scans")
async def dast_cancel(job_id: str, current_user: User = Depends(get_current_user)):
    ok = await dast_service.cancel(job_id)
    if not ok:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Não foi possível cancelar")
    return {"status": "cancelled", "job_id": job_id} 