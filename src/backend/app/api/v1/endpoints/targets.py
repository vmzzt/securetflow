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
from app.core.cache import cache

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

    # Invalida cache de listagem do usuário
    await cache.invalidate_prefix(f"targets:{current_user.id}:")
    
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
    cache_key = cache._make_key(f"targets:{current_user.id}:list", skip, limit)
    cached = await cache.get_json(cache_key)
    if cached is not None:
        return cached

    targets = db.query(Target).filter(Target.user_id == current_user.id)\
        .offset(skip).limit(limit).all()

    # Cache curto (30s) para aliviar carga em listagens
    await cache.set_json(cache_key, [t.__dict__ for t in targets], ttl_seconds=30)
    return targets

@router.get("/{target_id}", response_model=TargetResponse)
@require_permission("read:targets")
async def get_target(
    target_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obter target específico"""
    cache_key = cache._make_key(f"targets:{current_user.id}:get", target_id)
    cached = await cache.get_json(cache_key)
    if cached is not None:
        return cached

    target = db.query(Target).filter(
        Target.id == target_id,
        Target.user_id == current_user.id
    ).first()
    
    if not target:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Target não encontrado"
        )
    
    await cache.set_json(cache_key, target.__dict__, ttl_seconds=60)
    return target

@router.put("/{target_id}", response_model=TargetResponse)
@require_permission("write:targets")
async def update_target(
    target_id: int,
    payload: TargetUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_target = db.query(Target).filter(Target.id == target_id, Target.user_id == current_user.id).first()
    if not db_target:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Target não encontrado")

    for field, value in payload.dict(exclude_unset=True).items():
        setattr(db_target, field, value)

    db.commit()
    db.refresh(db_target)

    await cache.invalidate_prefix(f"targets:{current_user.id}:")
    return db_target

@router.delete("/{target_id}", status_code=status.HTTP_204_NO_CONTENT)
@require_permission("write:targets")
async def delete_target(
    target_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_target = db.query(Target).filter(Target.id == target_id, Target.user_id == current_user.id).first()
    if not db_target:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Target não encontrado")

    db.delete(db_target)
    db.commit()

    await cache.invalidate_prefix(f"targets:{current_user.id}:")
    return None 