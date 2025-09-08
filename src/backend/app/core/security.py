from typing import Callable, Optional
from functools import wraps
from fastapi import Depends, HTTPException, status

# Reexport do get_current_user do módulo auth
from app.core.auth import get_current_user  # noqa: F401

# RBAC simples baseado em role_id -> permissões
# 1=admin, 2=analyst, 3=viewer (compatível com seed)
ROLE_PERMISSIONS = {
    1: {"*"},
    2: {
        "read:vulnerabilities", "write:vulnerabilities",
        "read:reports", "write:reports",
        "read:targets", "write:targets",
        "read:scans", "write:scans",
        # Permissões adicionais para analista
        "read:ai", "read:monitoring",
    },
    3: {
        "read:vulnerabilities",
        "read:reports",
        "read:targets",
        "read:scans",
    },
}


def _has_permission(user, required: Optional[str]) -> bool:
    if user is None:
        return False
    if required is None:
        return True
    role_id = getattr(user, "role_id", None)
    if role_id is None:
        return False
    perms = ROLE_PERMISSIONS.get(role_id, set())
    return "*" in perms or required in perms


def require_permission(required: Optional[str] = None) -> Callable:
    """Decorator de autorização baseado em permissão simples.
    - Se required=None, apenas exige autenticação.
    - Caso contrário, verifica permissões pelo role_id do usuário.
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(*args, current_user=Depends(get_current_user), **kwargs):
            if current_user is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Not authenticated",
                )
            if not _has_permission(current_user, required):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Insufficient permissions",
                )
            return await func(*args, current_user=current_user, **kwargs)
        return wrapper
    return decorator 