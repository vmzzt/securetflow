from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.auth import get_current_user, get_password_hash, verify_password
from app.models.user import User

router = APIRouter()

class ProfileUpdate(BaseModel):
    full_name: str | None = None
    email: EmailStr | None = None
    department: str | None = None
    # role_id removido do update público para evitar escalonamento

class PasswordChange(BaseModel):
    current_password: str
    new_password: str

@router.get("/")
async def get_profile(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "department": current_user.department,
        "role_id": current_user.role_id,
        "last_login": current_user.last_login,
        "created_at": current_user.created_at,
        "updated_at": current_user.updated_at,
    }

@router.put("/")
async def update_profile(payload: ProfileUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if payload.email:
        exists = db.query(User).filter(User.email == payload.email, User.id != current_user.id).first()
        if exists:
            raise HTTPException(status_code=400, detail="Email já em uso")
    # role_id não é atualizável via endpoint de perfil
    updatable = payload.model_dump(exclude_unset=True)
    for field, value in updatable.items():
        setattr(current_user, field, value)
    db.commit()
    db.refresh(current_user)
    return {"message": "Perfil atualizado"}

@router.post("/change-password")
async def change_password(payload: PasswordChange, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not verify_password(payload.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Senha atual incorreta")
    if len(payload.new_password) < 8:
        raise HTTPException(status_code=400, detail="A nova senha deve ter pelo menos 8 caracteres")
    current_user.hashed_password = get_password_hash(payload.new_password)
    db.commit()
    return {"message": "Senha alterada"} 