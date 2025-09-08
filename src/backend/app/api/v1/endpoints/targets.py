"""
Securet Flow SSC - Targets Endpoints
Target management endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.models import User, Target
from app.schemas import TargetCreate, TargetUpdate, TargetResponse
from app.core.database import get_db
from app.core.auth import get_current_user
from app.core.security import require_permission

router = APIRouter()

@router.post("/", response_model=TargetResponse)
@require_permission("write:targets")
async def create_target(
    target: TargetCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Criar novo target"""
    # Criar target
    db_target = Target(
        name=target.name,
        host=target.host,
        port=target.port,
        protocol=target.protocol,
        description=target.description,
        user_id=current_user.id
    )
    
    db.add(db_target)
    db.commit()
    db.refresh(db_target)
    
    return db_target

@router.get("/", response_model=List[TargetResponse])
@require_permission("read:targets")
async def list_targets(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Listar targets do usuário"""
    targets = db.query(Target).filter(Target.user_id == current_user.id)\
        .offset(skip).limit(limit).all()
    return targets

@router.get("/{target_id}", response_model=TargetResponse)
@require_permission("read:targets")
async def get_target(
    target_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obter target específico"""
    target = db.query(Target).filter(
        Target.id == target_id,
        Target.user_id == current_user.id
    ).first()
    
    if not target:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Target não encontrado"
        )
    
    return target

@router.put("/{target_id}", response_model=TargetResponse)
@require_permission("write:targets")
async def update_target(
    target_id: int,
    target_update: TargetUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Atualizar target"""
    target = db.query(Target).filter(
        Target.id == target_id,
        Target.user_id == current_user.id
    ).first()
    
    if not target:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Target não encontrado"
        )
    
    # Atualizar campos
    for field, value in target_update.dict(exclude_unset=True).items():
        setattr(target, field, value)
    
    db.commit()
    db.refresh(target)
    
    return target

@router.delete("/{target_id}")
@require_permission("write:targets")
async def delete_target(
    target_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Deletar target"""
    target = db.query(Target).filter(
        Target.id == target_id,
        Target.user_id == current_user.id
    ).first()
    
    if not target:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Target não encontrado"
        )
    
    # Verificar se há scans associados
    if target.scans:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Não é possível deletar target com scans associados"
        )
    
    db.delete(target)
    db.commit()
    
    return {"message": "Target deletado com sucesso"} 