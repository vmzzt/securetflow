# 🔧 Securet Flow SSC - Backend Documentation

## 🏗️ Visão Geral do Backend

O backend do **Securet Flow SSC** é construído com uma arquitetura de microserviços moderna, utilizando FastAPI, Python 3.11+, e tecnologias enterprise-grade para garantir performance, escalabilidade e segurança.

## 🎯 Arquitetura de Microserviços

### **Estrutura de Serviços**
```yaml
Backend Services:
  Auth Service:
    - Port: 8001
    - Technology: FastAPI + JWT
    - Responsibilities: Authentication, Authorization, User Management
  
  Target Service:
    - Port: 8002
    - Technology: FastAPI + PostgreSQL
    - Responsibilities: Target Management, Risk Assessment
  
  Scan Service:
    - Port: 8003
    - Technology: FastAPI + Celery + Redis
    - Responsibilities: Scan Orchestration, Tool Integration
  
  Results Service:
    - Port: 8004
    - Technology: FastAPI + Elasticsearch
    - Responsibilities: Vulnerability Analysis, Data Processing
  
  AI Service:
    - Port: 8005
    - Technology: FastAPI + Ollama + OpenAI
    - Responsibilities: LLM Integration, AI Analysis
  
  Report Service:
    - Port: 8006
    - Technology: FastAPI + Jinja2 + WeasyPrint
    - Responsibilities: Report Generation, Export
  
  Integration Service:
    - Port: 8007
    - Technology: FastAPI + Webhooks
    - Responsibilities: Third-party Integrations
```

## 🛠️ Tecnologias Utilizadas

### **Core Framework**
```python
# FastAPI - Framework principal
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer

app = FastAPI(
    title="Securet Flow SSC API",
    description="Enterprise Security Testing Platform",
    version="4.0.0-master",
    docs_url="/docs",
    redoc_url="/redoc"
)
```

### **Database & ORM**
```python
# SQLAlchemy 2.0 - ORM moderno
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

# PostgreSQL - Database principal
DATABASE_URL = "postgresql+asyncpg://user:pass@localhost/securet_flow"

# Alembic - Migrations
# alembic revision --autogenerate -m "Add new table"
# alembic upgrade head
```

### **Cache & Queue**
```python
# Redis - Cache e filas
import redis.asyncio as redis

# Celery - Task queue
from celery import Celery

celery_app = Celery(
    "securet_flow",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/1"
)
```

### **Search & Analytics**
```python
# Elasticsearch - Busca e analytics
from elasticsearch import AsyncElasticsearch

es_client = AsyncElasticsearch(
    hosts=["localhost:9200"],
    timeout=30,
    max_retries=3,
    retry_on_timeout=True
)
```

## 📁 Estrutura do Projeto

```
src/backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # Entry point da aplicação
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py           # Configurações
│   │   ├── database.py         # Conexão com banco
│   │   ├── security.py         # Autenticação e segurança
│   │   ├── middleware.py       # Middlewares customizados
│   │   └── logging.py          # Configuração de logs
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py             # Modelo de usuário
│   │   ├── target.py           # Modelo de target
│   │   ├── scan.py             # Modelo de scan
│   │   ├── vulnerability.py    # Modelo de vulnerabilidade
│   │   └── report.py           # Modelo de relatório
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── auth.py             # Schemas de autenticação
│   │   ├── target.py           # Schemas de target
│   │   ├── scan.py             # Schemas de scan
│   │   └── vulnerability.py    # Schemas de vulnerabilidade
│   ├── api/
│   │   ├── __init__.py
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── api.py          # Router principal
│   │   │   └── endpoints/
│   │   │       ├── __init__.py
│   │   │       ├── auth.py     # Endpoints de auth
│   │   │       ├── targets.py  # Endpoints de targets
│   │   │       ├── scans.py    # Endpoints de scans
│   │   │       └── vulns.py    # Endpoints de vulnerabilidades
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth_service.py     # Lógica de autenticação
│   │   ├── target_service.py   # Lógica de targets
│   │   ├── scan_service.py     # Lógica de scans
│   │   └── ai_service.py       # Lógica de IA
│   └── utils/
│       ├── __init__.py
│       ├── security.py         # Utilitários de segurança
│       ├── validators.py       # Validadores customizados
│       └── helpers.py          # Funções auxiliares
├── tests/
│   ├── __init__.py
│   ├── conftest.py             # Configuração de testes
│   ├── test_api/               # Testes de API
│   ├── test_services/          # Testes de serviços
│   └── test_utils/             # Testes de utilitários
├── alembic/                    # Migrations
│   ├── versions/
│   ├── env.py
│   └── alembic.ini
├── requirements.txt            # Dependências Python
├── Dockerfile                  # Container do backend
└── docker-compose.yml          # Orquestração local
```

## 🔐 Sistema de Autenticação

### **JWT Authentication**
```python
# JWT Token Management
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta

class AuthService:
    def __init__(self):
        self.secret_key = settings.SECRET_KEY
        self.algorithm = "HS256"
        self.access_token_expire_minutes = 30
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    
    def create_access_token(self, data: dict):
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=self.access_token_expire_minutes)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt
    
    def verify_password(self, plain_password: str, hashed_password: str):
        return self.pwd_context.verify(plain_password, hashed_password)
    
    def get_password_hash(self, password: str):
        return self.pwd_context.hash(password)
```

### **Role-Based Access Control (RBAC)**
```python
# RBAC Implementation
from enum import Enum
from typing import List

class UserRole(str, Enum):
    ADMIN = "admin"
    SECURITY_ANALYST = "security_analyst"
    MANAGER = "manager"
    VIEWER = "viewer"

class Permission(str, Enum):
    READ_TARGETS = "read:targets"
    WRITE_TARGETS = "write:targets"
    READ_SCANS = "read:scans"
    WRITE_SCANS = "write:scans"
    READ_VULNERABILITIES = "read:vulnerabilities"
    WRITE_REPORTS = "write:reports"

def require_permission(permission: Permission):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            user = get_current_user()
            if not has_permission(user, permission):
                raise HTTPException(
                    status_code=403,
                    detail="Insufficient permissions"
                )
            return await func(*args, **kwargs)
        return wrapper
    return decorator
```

## 🗄️ Modelo de Dados

### **User Model**
```python
# SQLAlchemy Model
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.VIEWER)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    mfa_enabled = Column(Boolean, default=False)
    mfa_secret = Column(String, nullable=True)
    last_login = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    targets = relationship("Target", back_populates="owner")
    scans = relationship("Scan", back_populates="created_by_user")
```

### **Target Model**
```python
class Target(Base):
    __tablename__ = "targets"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    type = Column(Enum(TargetType), nullable=False)
    url = Column(String, nullable=True)
    network_range = Column(String, nullable=True)
    category = Column(Enum(TargetCategory), nullable=False)
    status = Column(Enum(TargetStatus), default=TargetStatus.ACTIVE)
    risk_score = Column(Integer, default=0)
    tags = Column(ARRAY(String), default=[])
    business_unit = Column(String, nullable=True)
    compliance = Column(ARRAY(String), default=[])
    owner_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    owner = relationship("User", back_populates="targets")
    scans = relationship("Scan", back_populates="target")
    vulnerabilities = relationship("Vulnerability", back_populates="target")
```

## 🔄 Sistema de Scans

### **Scan Orchestration**
```python
# Scan Service
class ScanService:
    def __init__(self):
        self.celery_app = celery_app
        self.tool_registry = ToolRegistry()
    
    async def create_scan(self, scan_data: ScanCreate, user: User) -> Scan:
        # Create scan record
        scan = Scan(
            target_id=scan_data.target_id,
            scan_type=scan_data.scan_type,
            tools=scan_data.tools,
            priority=scan_data.priority,
            created_by=user.id
        )
        
        db.add(scan)
        await db.commit()
        await db.refresh(scan)
        
        # Queue scan execution
        self.celery_app.send_task(
            "tasks.execute_scan",
            args=[scan.id],
            countdown=scan_data.scheduled_at.timestamp() if scan_data.scheduled_at else 0
        )
        
        return scan
    
    async def get_scan_status(self, scan_id: int) -> ScanStatus:
        scan = await self.get_scan(scan_id)
        return ScanStatus(
            id=scan.id,
            status=scan.status,
            progress=scan.progress,
            started_at=scan.started_at,
            completed_at=scan.completed_at,
            results_summary=scan.results_summary
        )
```

### **Tool Integration**
```python
# Tool Registry
class ToolRegistry:
    def __init__(self):
        self.tools = {
            "nuclei": NucleiTool(),
            "zap": ZapTool(),
            "sqlmap": SqlmapTool(),
            "nmap": NmapTool(),
            "nikto": NiktoTool(),
            # ... mais ferramentas
        }
    
    def get_tool(self, tool_name: str) -> BaseTool:
        if tool_name not in self.tools:
            raise ValueError(f"Tool {tool_name} not found")
        return self.tools[tool_name]
    
    async def execute_tool(self, tool_name: str, target: Target, options: dict) -> ToolResult:
        tool = self.get_tool(tool_name)
        return await tool.execute(target, options)

# Base Tool Class
class BaseTool:
    def __init__(self):
        self.name = self.__class__.__name__
        self.version = "1.0.0"
    
    async def execute(self, target: Target, options: dict) -> ToolResult:
        raise NotImplementedError
    
    async def parse_results(self, raw_output: str) -> List[Vulnerability]:
        raise NotImplementedError
```

## 🤖 Integração com IA

### **AI Service**
```python
# AI Service Integration
class AIService:
    def __init__(self):
        self.ollama_client = OllamaClient()
        self.openai_client = OpenAIClient()
        self.anthropic_client = AnthropicClient()
    
    async def analyze_vulnerability(self, vuln_data: dict) -> dict:
        """Análise inteligente de vulnerabilidade"""
        # Análise com múltiplos modelos
        analyses = await asyncio.gather(
            self.ollama_client.analyze_vulnerability(vuln_data),
            self.openai_client.analyze_vulnerability(vuln_data),
            self.anthropic_client.generate_security_insights(vuln_data)
        )
        
        # Consolidação dos resultados
        return self.consolidate_analyses(analyses)
    
    async def detect_false_positive(self, vuln_data: dict) -> dict:
        """Detecção de falsos positivos"""
        analysis = await self.ollama_client.analyze_false_positive(vuln_data)
        return {
            "is_false_positive": analysis.get("is_false_positive", False),
            "confidence": analysis.get("confidence", 0.0),
            "reasons": analysis.get("reasons", [])
        }
    
    async def generate_recommendations(self, context: dict) -> List[dict]:
        """Geração de recomendações"""
        recommendations = await self.openai_client.generate_recommendations(context)
        return self.prioritize_recommendations(recommendations)
```

## 📊 Monitoramento e Observabilidade

### **Metrics Collection**
```python
# Prometheus Metrics
from prometheus_client import Counter, Histogram, Gauge

# Metrics
SCAN_DURATION = Histogram('scan_duration_seconds', 'Scan execution time')
VULNERABILITIES_FOUND = Counter('vulnerabilities_total', 'Total vulnerabilities found')
ACTIVE_SCANS = Gauge('active_scans', 'Number of active scans')
API_REQUESTS = Counter('api_requests_total', 'Total API requests', ['endpoint', 'method'])

# Middleware para coletar métricas
@app.middleware("http")
async def collect_metrics(request: Request, call_next):
    start_time = time.time()
    
    response = await call_next(request)
    
    # Record metrics
    duration = time.time() - start_time
    API_REQUESTS.labels(
        endpoint=request.url.path,
        method=request.method
    ).inc()
    
    return response
```

### **Structured Logging**
```python
# Structured Logging
import structlog
import logging

# Configure structlog
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()

# Usage
def log_scan_event(scan_id: int, event_type: str, details: dict):
    logger.info(
        "scan_event",
        scan_id=scan_id,
        event_type=event_type,
        details=details,
        timestamp=datetime.utcnow().isoformat()
    )
```

## 🧪 Testing

### **Unit Tests**
```python
# Unit Test Example
import pytest
from unittest.mock import Mock, patch
from app.services.target_service import TargetService

class TestTargetService:
    @pytest.fixture
    def target_service(self):
        return TargetService()
    
    @pytest.fixture
    def mock_db(self):
        return Mock()
    
    async def test_create_target(self, target_service, mock_db):
        # Arrange
        target_data = {
            "name": "test.com",
            "type": "web",
            "url": "https://test.com",
            "category": "development"
        }
        
        # Act
        with patch('app.services.target_service.get_db', return_value=mock_db):
            result = await target_service.create_target(target_data, user_id=1)
        
        # Assert
        assert result.name == "test.com"
        assert result.type == "web"
        mock_db.add.assert_called_once()
        mock_db.commit.assert_called_once()
```

### **Integration Tests**
```python
# Integration Test Example
import pytest
from httpx import AsyncClient
from app.main import app

class TestTargetAPI:
    @pytest.mark.asyncio
    async def test_create_target(self):
        async with AsyncClient(app=app, base_url="http://test") as ac:
            response = await ac.post(
                "/api/v1/targets",
                json={
                    "name": "test.com",
                    "type": "web",
                    "url": "https://test.com",
                    "category": "development"
                },
                headers={"Authorization": "Bearer test_token"}
            )
        
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "test.com"
        assert data["type"] == "web"
```

## 🚀 Deployment

### **Docker Configuration**
```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### **Docker Compose**
```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./src/backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/securet_flow
      - REDIS_URL=redis://redis:6379
      - SECRET_KEY=${SECRET_KEY}
    depends_on:
      - postgres
      - redis
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped
```

## 📚 Documentação Adicional

### **Links Úteis**
- [🏗️ Arquitetura Detalhada](architecture.md)
- [🗄️ Modelo de Dados](data-model.md)
- [🔐 Segurança](security.md)
- [🚀 Deploy](deployment.md)

### **APIs**
- [📊 API Documentation](../api/README.md)
- [🔗 Endpoints](../api/endpoints.md)
- [💡 Exemplos](../api/examples.md)

### **Ferramentas**
- [🛠️ Ferramentas de Segurança](../tools/README.md)
- [🤖 Integração IA](../ai/README.md)

---

**Última atualização**: 27 de Agosto de 2025  
**Versão**: 4.0.0-master  
**Status**: ✅ **Backend Completo e Documentado** 