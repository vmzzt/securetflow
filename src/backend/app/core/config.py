"""
Securet Flow SSC - Configuration
Application configuration and settings
"""

import os
from typing import List, Optional
from pydantic_settings import BaseSettings

from functools import lru_cache

try:
    import hvac  # type: ignore
except Exception:  # hvac é opcional
    hvac = None


def _read_secret(path: Optional[str], fallback: Optional[str]) -> Optional[str]:
    if path and os.path.exists(path):
        try:
            with open(path, "r", encoding="utf-8") as f:
                return f.read().strip()
        except Exception:
            return fallback
    return fallback


def _read_from_vault(mount: Optional[str], secret_path: Optional[str], key: Optional[str], fallback: Optional[str]) -> Optional[str]:
    if not hvac or not os.getenv("VAULT_ADDR") or not os.getenv("VAULT_TOKEN"):
        return fallback
    if not mount or not secret_path or not key:
        return fallback
    try:
        client = hvac.Client(url=os.getenv("VAULT_ADDR"), token=os.getenv("VAULT_TOKEN"))
        resp = client.secrets.kv.v2.read_secret_version(path=secret_path, mount_point=mount)
        return resp["data"]["data"].get(key, fallback)
    except Exception:
        return fallback


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "Securet Flow SSC"
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    VERSION: str = "1.0.0"
    
    # Server
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # Database
    DATABASE_URL: str = _read_secret(
        os.getenv("DATABASE_URL_FILE"),
        _read_from_vault(os.getenv("VAULT_MOUNT"), os.getenv("VAULT_DB_PATH"), "DATABASE_URL", os.getenv(
            "DATABASE_URL",
            "postgresql://securet_user:securet_password@localhost:5432/securet_flow",
        )),
    )
    
    # Security
    JWT_SECRET_KEY: str = _read_secret(
        os.getenv("JWT_SECRET_KEY_FILE"),
        _read_from_vault(os.getenv("VAULT_MOUNT"), os.getenv("VAULT_JWT_PATH"), "JWT_SECRET_KEY", os.getenv("JWT_SECRET_KEY", "change-this-immediately"))
    )
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    JWT_PRIVATE_KEY: Optional[str] = _read_secret(
        os.getenv("JWT_PRIVATE_KEY_FILE"),
        _read_from_vault(os.getenv("VAULT_MOUNT"), os.getenv("VAULT_JWT_PATH"), "JWT_PRIVATE_KEY", os.getenv("JWT_PRIVATE_KEY"))
    )  # PEM
    JWT_PUBLIC_KEY: Optional[str] = _read_secret(
        os.getenv("JWT_PUBLIC_KEY_FILE"),
        _read_from_vault(os.getenv("VAULT_MOUNT"), os.getenv("VAULT_JWT_PATH"), "JWT_PUBLIC_KEY", os.getenv("JWT_PUBLIC_KEY"))
    )    # PEM
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("JWT_EXPIRATION", "30"))
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("JWT_REFRESH_EXPIRATION", "7"))
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8080",
        "https://securet-flow.com"
    ]
    
    # Trusted Hosts
    ALLOWED_HOSTS: List[str] = [
        "localhost",
        "127.0.0.1",
        "securet-flow.com"
    ]
    
    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    
    # Ollama
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_API_KEY: str = os.getenv("OLLAMA_API_KEY", "")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "llama2")
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = int(os.getenv("RATE_LIMIT_PER_MINUTE", "60"))
    RATE_LIMIT_PER_HOUR: int = int(os.getenv("RATE_LIMIT_PER_HOUR", "1000"))
    
    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create settings instance
settings = Settings() 