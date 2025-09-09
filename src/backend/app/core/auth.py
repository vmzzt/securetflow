from datetime import datetime, timedelta
from typing import Optional, TYPE_CHECKING
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db

if TYPE_CHECKING:
    from app.models.user import User

# Configuração de senha
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Configuração do bearer token
security = HTTPBearer()


def _get_signing_key() -> str:
    """Obtém a chave de assinatura de acordo com o algoritmo configurado."""
    if settings.JWT_ALGORITHM.startswith("RS") or settings.JWT_ALGORITHM.startswith("ES"):
        if not settings.JWT_PRIVATE_KEY:
            raise RuntimeError("JWT_PRIVATE_KEY não configurada para algoritmo assimétrico")
        return settings.JWT_PRIVATE_KEY
    return settings.JWT_SECRET_KEY


def _get_verification_key() -> str:
    """Obtém a chave de verificação para algoritmos assimétricos."""
    if settings.JWT_ALGORITHM.startswith("RS") or settings.JWT_ALGORITHM.startswith("ES"):
        if not settings.JWT_PUBLIC_KEY:
            raise RuntimeError("JWT_PUBLIC_KEY não configurada para algoritmo assimétrico")
        return settings.JWT_PUBLIC_KEY
    return settings.JWT_SECRET_KEY


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica se a senha está correta"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Gera hash da senha"""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Cria token de acesso JWT"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    signing_key = _get_signing_key()
    encoded_jwt = jwt.encode(to_encode, signing_key, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> Optional[str]:
    """Verifica e decodifica o token JWT"""
    try:
        verification_key = _get_verification_key()
        payload = jwt.decode(token, verification_key, algorithms=[settings.JWT_ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            return None
        return username
    except JWTError:
        return None


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> "User":
    """Obtém o usuário atual baseado no token JWT"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        token = credentials.credentials
        username = verify_token(token)
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    from app.models.user import User
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception
    
    return user


async def get_current_active_user(current_user: "User" = Depends(get_current_user)) -> "User":
    """Obtém o usuário atual ativo"""
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user 