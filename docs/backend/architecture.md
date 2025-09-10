# Purple Team Platform V4 Master - Arquitetura Backend

## 🏗️ Visão Geral da Arquitetura

A Purple Team Platform V4 Master utiliza uma arquitetura de microserviços moderna e escalável, projetada para suportar operações enterprise-grade de security testing e purple team operations.

## 🎯 Princípios Arquiteturais

### **1. Microserviços**
- **Separação de Responsabilidades**: Cada serviço tem uma função específica
- **Escalabilidade Independente**: Serviços podem ser escalados individualmente
- **Falha Isolada**: Problemas em um serviço não afetam outros
- **Tecnologia Flexível**: Cada serviço pode usar a melhor tecnologia

### **2. Event-Driven Architecture**
- **Comunicação Assíncrona**: Serviços se comunicam via eventos
- **Desacoplamento**: Baixo acoplamento entre serviços
- **Resiliência**: Sistema continua funcionando mesmo com falhas
- **Escalabilidade**: Processamento paralelo de eventos

### **3. API-First Design**
- **RESTful APIs**: Padrões REST bem definidos
- **GraphQL**: Para consultas complexas
- **WebSocket**: Para comunicação em tempo real
- **Versionamento**: APIs versionadas para compatibilidade

### **4. Security by Design**
- **Zero Trust**: Nenhuma confiança implícita
- **Defense in Depth**: Múltiplas camadas de segurança
- **Princípio do Menor Privilégio**: Acesso mínimo necessário
- **Audit Logging**: Logs completos de todas as ações

## 🏢 Arquitetura de Microserviços

### **1. API Gateway (Kong)**
```yaml
Service: api-gateway
Technology: Kong Gateway
Port: 8000
Responsibilities:
  - Rate Limiting
  - Authentication/Authorization
  - Request Routing
  - Load Balancing
  - API Documentation
  - Monitoring & Analytics
```

### **2. Authentication Service**
```yaml
Service: auth-service
Technology: Python/FastAPI + JWT
Port: 8001
Responsibilities:
  - User Authentication
  - JWT Token Management
  - OAuth2 Integration
  - Role-Based Access Control (RBAC)
  - Session Management
  - Multi-Factor Authentication (MFA)
```

### **3. Target Management Service**
```yaml
Service: target-service
Technology: Python/FastAPI + PostgreSQL
Port: 8002
Responsibilities:
  - Target CRUD Operations
  - Risk Assessment
  - Target Categorization
  - Business Unit Management
  - Compliance Tracking
  - Target Analytics
```

### **4. Scan Engine Service**
```yaml
Service: scan-service
Technology: Python/FastAPI + Celery + Redis
Port: 8003
Responsibilities:
  - Scan Orchestration
  - Tool Integration
  - Scan Scheduling
  - Progress Tracking
  - Resource Management
  - Scan Optimization
```

### **5. Results Analysis Service**
```yaml
Service: results-service
Technology: Python/FastAPI + Elasticsearch
Port: 8004
Responsibilities:
  - Vulnerability Analysis
  - False Positive Detection
  - Risk Scoring
  - Trend Analysis
  - Correlation Engine
  - Data Enrichment
```

### **6. AI/LLM Service**
```yaml
Service: ai-service
Technology: Python/FastAPI + Ollama + OpenAI
Port: 8005
Responsibilities:
  - LLM Integration
  - Vulnerability Analysis
  - Pattern Detection
  - Recommendations
  - Natural Language Processing
  - AI Model Management
```

### **7. Report Generation Service**
```yaml
Service: report-service
Technology: Python/FastAPI + Jinja2 + WeasyPrint
Port: 8006
Responsibilities:
  - Report Generation
  - Template Management
  - Export Formats (PDF, HTML, JSON)
  - Custom Reports
  - Report Scheduling
  - Report Distribution
```

### **8. Integration Service**
```yaml
Service: integration-service
Technology: Python/FastAPI + Webhooks
Port: 8007
Responsibilities:
  - Third-party Integrations
  - Webhook Management
  - API Synchronization
  - Data Transformation
  - Integration Monitoring
  - Error Handling
```

## 🗄️ Camada de Dados

### **1. PostgreSQL (Primary Database)**
```sql
-- Core Tables
users              -- User management
targets            -- Target information
scans              -- Scan execution
vulnerabilities    -- Vulnerability data
reports            -- Report metadata
integrations       -- Integration configs
audit_logs         -- Security audit logs

-- Analytics Tables
scan_metrics       -- Scan performance
vulnerability_trends -- Trend analysis
user_activity      -- User behavior
system_health      -- System monitoring
```

### **2. Redis (Cache & Queue)**
```redis
# Cache Keys
user:session:{user_id}     -- User sessions
target:cache:{target_id}   -- Target data cache
scan:progress:{scan_id}    -- Scan progress
api:rate_limit:{ip}        -- Rate limiting

# Queue Names
scan_queue                 -- Scan execution queue
report_queue              -- Report generation queue
notification_queue        -- Notification queue
ai_analysis_queue         -- AI analysis queue
```

### **3. Elasticsearch (Search & Analytics)**
```json
{
  "indices": {
    "vulnerabilities": "Vulnerability search and analytics",
    "scan_results": "Scan result search",
    "audit_logs": "Audit log search",
    "system_metrics": "System performance metrics"
  }
}
```

## 🔄 Comunicação Entre Serviços

### **1. Synchronous Communication (HTTP/REST)**
```python
# Service-to-Service Communication
async def get_target_details(target_id: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{TARGET_SERVICE_URL}/targets/{target_id}")
        return response.json()
```

### **2. Asynchronous Communication (Events)**
```python
# Event Publishing
async def publish_scan_completed_event(scan_id: str, results: dict):
    event = {
        "event_type": "scan.completed",
        "scan_id": scan_id,
        "results": results,
        "timestamp": datetime.utcnow().isoformat()
    }
    await redis.publish("events", json.dumps(event))
```

### **3. Message Queue (Celery)**
```python
# Task Definition
@celery_app.task
def run_security_scan(target_id: str, scan_type: str):
    # Scan execution logic
    pass

# Task Execution
task = run_security_scan.delay(target_id, "vulnerability_scan")
```

## 🔐 Segurança da Arquitetura

### **1. Network Security**
```yaml
Network Layers:
  - Public Network: API Gateway only
  - Private Network: Internal services
  - Database Network: Database access only
  - Management Network: Monitoring and admin
```

### **2. Authentication & Authorization**
```python
# JWT Token Structure
{
  "user_id": "123",
  "username": "admin",
  "roles": ["admin", "security_analyst"],
  "permissions": ["read:targets", "write:scans"],
  "exp": 1640995200,
  "iat": 1640908800
}
```

### **3. Data Encryption**
```yaml
Encryption Levels:
  - Transport: TLS 1.3 for all communications
  - Storage: AES-256 for sensitive data
  - Database: Column-level encryption
  - Backups: Encrypted backup storage
```

## 📊 Monitoramento e Observabilidade

### **1. Metrics Collection**
```python
# Prometheus Metrics
SCAN_DURATION = Histogram('scan_duration_seconds', 'Scan execution time')
VULNERABILITIES_FOUND = Counter('vulnerabilities_total', 'Total vulnerabilities found')
ACTIVE_SCANS = Gauge('active_scans', 'Number of active scans')
```

### **2. Distributed Tracing**
```python
# OpenTelemetry Integration
from opentelemetry import trace

tracer = trace.get_tracer(__name__)

def run_scan_with_tracing(target_id: str):
    with tracer.start_as_current_span("security_scan") as span:
        span.set_attribute("target.id", target_id)
        # Scan execution
        span.set_attribute("scan.result", "completed")
```

### **3. Centralized Logging**
```python
# Structured Logging
import structlog

logger = structlog.get_logger()

def log_scan_event(scan_id: str, event_type: str, details: dict):
    logger.info(
        "scan_event",
        scan_id=scan_id,
        event_type=event_type,
        details=details,
        timestamp=datetime.utcnow().isoformat()
    )
```

## 🚀 Deployment Architecture

### **1. Container Orchestration**
```yaml
# Docker Compose Services
services:
  api-gateway:
    image: kong/kong-gateway:3.4
    ports: ["8000:8000"]
    
  auth-service:
    build: ./backend/auth-service
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/purpleteam
      
  target-service:
    build: ./backend/target-service
    depends_on: [postgres, redis]
```

### **2. Kubernetes Deployment**
```yaml
# Kubernetes Manifest
apiVersion: apps/v1
kind: Deployment
metadata:
  name: target-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: target-service
  template:
    metadata:
      labels:
        app: target-service
    spec:
      containers:
      - name: target-service
        image: purple-team/target-service:latest
        ports:
        - containerPort: 8002
```

### **3. Service Mesh (Istio)**
```yaml
# Istio Virtual Service
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: purple-team-api
spec:
  hosts:
  - api.purpleteam.local
  gateways:
  - purple-team-gateway
  http:
  - route:
    - destination:
        host: api-gateway
        port:
          number: 8000
```

## 📈 Escalabilidade

### **1. Horizontal Scaling**
```yaml
# Auto-scaling Configuration
autoscaling:
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70
  targetMemoryUtilizationPercentage: 80
```

### **2. Database Scaling**
```yaml
# PostgreSQL Read Replicas
postgres-primary:
  image: postgres:16
  environment:
    POSTGRES_DB: purpleteam
    
postgres-replica-1:
  image: postgres:16
  environment:
    POSTGRES_DB: purpleteam
    POSTGRES_MASTER_HOST: postgres-primary
```

### **3. Cache Distribution**
```yaml
# Redis Cluster
redis-cluster:
  image: redis:7-alpine
  command: redis-server --cluster-enabled yes --cluster-config-file nodes.conf
  ports:
    - "7000:7000"
    - "7001:7001"
    - "7002:7002"
```

## 🔧 Configuração e Gerenciamento

### **1. Configuration Management**
```python
# Environment-based Configuration
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    redis_url: str
    jwt_secret: str
    api_key: str
    
    class Config:
        env_file = ".env"
```

### **2. Feature Flags**
```python
# Feature Toggle System
from featureflags import FeatureFlags

flags = FeatureFlags()

@flags.enabled("ai_analysis")
def run_ai_analysis(vulnerability_data: dict):
    # AI analysis logic
    pass
```

### **3. Health Checks**
```python
# Health Check Endpoints
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "4.0.0-master",
        "services": {
            "database": await check_database_health(),
            "redis": await check_redis_health(),
            "elasticsearch": await check_elasticsearch_health()
        }
    }
```

## 🧪 Testing Strategy

### **1. Unit Testing**
```python
# Unit Test Example
import pytest
from unittest.mock import Mock, patch

def test_target_creation():
    with patch('services.database.create_target') as mock_create:
        mock_create.return_value = {"id": "123", "name": "test.com"}
        
        result = create_target("test.com", "web")
        
        assert result["id"] == "123"
        mock_create.assert_called_once_with("test.com", "web")
```

### **2. Integration Testing**
```python
# Integration Test Example
@pytest.mark.integration
async def test_scan_workflow():
    # Create target
    target = await create_target("example.com", "web")
    
    # Start scan
    scan = await start_scan(target["id"], "vulnerability")
    
    # Wait for completion
    result = await wait_for_scan_completion(scan["id"])
    
    assert result["status"] == "completed"
    assert len(result["vulnerabilities"]) >= 0
```

### **3. Load Testing**
```python
# Load Test Example
import locust

class PurpleTeamLoadTest(locust.HttpUser):
    @locust.task
    def test_target_creation(self):
        self.client.post("/api/targets", json={
            "name": "test.com",
            "type": "web"
        })
    
    @locust.task
    def test_scan_execution(self):
        self.client.post("/api/scans", json={
            "target_id": "123",
            "scan_type": "vulnerability"
        })
```

## 📚 Documentação da API

### **1. OpenAPI Specification**
```yaml
# OpenAPI 3.0 Specification
openapi: 3.0.0
info:
  title: Purple Team Platform V4 Master API
  version: 4.0.0-master
  description: Enterprise Security Testing Platform API

paths:
  /api/targets:
    get:
      summary: List targets
      responses:
        '200':
          description: List of targets
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Target'
```

### **2. API Versioning**
```python
# API Version Management
from fastapi import APIRouter

v1_router = APIRouter(prefix="/api/v1")
v2_router = APIRouter(prefix="/api/v2")

# Version 1 endpoints
@v1_router.get("/targets")
async def get_targets_v1():
    # V1 implementation
    pass

# Version 2 endpoints
@v2_router.get("/targets")
async def get_targets_v2():
    # V2 implementation with improvements
    pass
```

## 🎯 Próximos Passos

### **1. Implementação Fase 1**
- [ ] Setup da infraestrutura base
- [ ] Implementação dos serviços core
- [ ] Configuração do banco de dados
- [ ] Setup do sistema de autenticação

### **2. Implementação Fase 2**
- [ ] Integração com ferramentas de security
- [ ] Implementação do sistema de scans
- [ ] Desenvolvimento da análise de resultados
- [ ] Integração com IA/LLM

### **3. Implementação Fase 3**
- [ ] Sistema de relatórios
- [ ] Integrações externas
- [ ] Monitoramento e observabilidade
- [ ] Testes de carga e performance

---

**Última atualização**: 21 de Agosto de 2025  
**Versão**: 4.0.0-master  
**Status**: ✅ Arquitetura Definida e Documentada 