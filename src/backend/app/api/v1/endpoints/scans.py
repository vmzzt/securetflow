"""
Securet Flow SSC - Scans Endpoints
Scan management endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.models import User, Scan, Target
from app.schemas import ScanCreate, ScanUpdate, ScanResponse
from app.core.database import get_db
from app.core.auth import get_current_user
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=ScanResponse)
async def create_scan(
    scan: ScanCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Criar novo scan"""
    # Verificar se target existe
    target = db.query(Target).filter(Target.id == scan.target_id).first()
    if not target:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Target não encontrado"
        )
    
    # Criar scan
    db_scan = Scan(
        name=scan.name,
        description=scan.description,
        target_id=scan.target_id,
        user_id=current_user.id,
        scan_type=scan.scan_type
    )
    
    db.add(db_scan)
    db.commit()
    db.refresh(db_scan)
    
    return db_scan

@router.get("/", response_model=List[ScanResponse])
async def list_scans(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Listar scans do usuário"""
    scans = db.query(Scan).filter(Scan.user_id == current_user.id)\
        .offset(skip).limit(limit).all()
    return scans

@router.get("/{scan_id}", response_model=ScanResponse)
async def get_scan(
    scan_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obter scan específico"""
    scan = db.query(Scan).filter(
        Scan.id == scan_id,
        Scan.user_id == current_user.id
    ).first()
    
    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan não encontrado"
        )
    
    return scan

@router.put("/{scan_id}", response_model=ScanResponse)
async def update_scan(
    scan_id: int,
    scan_update: ScanUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Atualizar scan"""
    scan = db.query(Scan).filter(
        Scan.id == scan_id,
        Scan.user_id == current_user.id
    ).first()
    
    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan não encontrado"
        )
    
    # Atualizar campos
    for field, value in scan_update.dict(exclude_unset=True).items():
        setattr(scan, field, value)
    
    db.commit()
    db.refresh(scan)
    
    return scan

@router.delete("/{scan_id}")
async def delete_scan(
    scan_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Deletar scan"""
    scan = db.query(Scan).filter(
        Scan.id == scan_id,
        Scan.user_id == current_user.id
    ).first()
    
    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan não encontrado"
        )
    
    db.delete(scan)
    db.commit()
    
    return {"message": "Scan deletado com sucesso"}

@router.post("/{scan_id}/start")
async def start_scan(
    scan_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Iniciar scan"""
    scan = db.query(Scan).filter(
        Scan.id == scan_id,
        Scan.user_id == current_user.id
    ).first()
    
    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan não encontrado"
        )
    
    if scan.status == "running":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Scan já está em execução"
        )
    
    # Atualizar status
    scan.status = "running"
    scan.started_at = datetime.utcnow()
    
    db.commit()
    db.refresh(scan)
    
    # TODO: Implementar execução real do scan
    # await execute_scan(scan)
    
    return {"message": "Scan iniciado com sucesso"}

@router.post("/{scan_id}/stop")
async def stop_scan(
    scan_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Parar scan"""
    scan = db.query(Scan).filter(
        Scan.id == scan_id,
        Scan.user_id == current_user.id
    ).first()
    
    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan não encontrado"
        )
    
    if scan.status != "running":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Scan não está em execução"
        )
    
    # Atualizar status
    scan.status = "completed"
    scan.completed_at = datetime.utcnow()
    
    db.commit()
    db.refresh(scan)
    
    return {"message": "Scan parado com sucesso"} 