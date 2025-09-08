from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.role import Role
from app.schemas.role import RoleCreate, RoleUpdate, RoleResponse
from app.core.security import require_permission, get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[RoleResponse])
@require_permission("read:roles")
async def list_roles(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Role).all()

@router.post("/", response_model=RoleResponse, status_code=status.HTTP_201_CREATED)
@require_permission("write:roles")
async def create_role(role_in: RoleCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    exists = db.query(Role).filter(Role.name == role_in.name).first()
    if exists:
        raise HTTPException(status_code=400, detail="Role já existe")
    role = Role(name=role_in.name, description=role_in.description)
    db.add(role)
    db.commit()
    db.refresh(role)
    return role

@router.get("/{role_id}", response_model=RoleResponse)
@require_permission("read:roles")
async def get_role(role_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role não encontrada")
    return role

@router.put("/{role_id}", response_model=RoleResponse)
@require_permission("write:roles")
async def update_role(role_id: int, role_in: RoleUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role não encontrada")
    for k, v in role_in.model_dump(exclude_unset=True).items():
        setattr(role, k, v)
    db.commit()
    db.refresh(role)
    return role

@router.delete("/{role_id}")
@require_permission("write:roles")
async def delete_role(role_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role não encontrada")
    if role.users:
        raise HTTPException(status_code=400, detail="Não é possível excluir role com usuários associados")
    db.delete(role)
    db.commit()
    return {"message": "Role removida"} 