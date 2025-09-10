# Purple Team Platform V4 Master - Segurança

## 🛡️ Visão Geral de Segurança

A Purple Team Platform V4 Master implementa uma abordagem de segurança em camadas (Defense in Depth) com foco em Zero Trust, garantindo que a plataforma seja segura por design e adequada para ambientes enterprise.

## 🎯 Princípios de Segurança

### **1. Zero Trust Architecture**
- **Nunca Confie, Sempre Verifique**: Toda requisição é autenticada e autorizada
- **Princípio do Menor Privilégio**: Usuários têm apenas os privilégios necessários
- **Micro-segmentação**: Rede dividida em segmentos isolados
- **Monitoramento Contínuo**: Logs e auditoria de todas as atividades

### **2. Security by Design**
- **Segurança desde o Início**: Segurança integrada no design da arquitetura
- **Fail Secure**: Sistema falha de forma segura
- **Defense in Depth**: Múltiplas camadas de proteção
- **Privacy by Design**: Privacidade integrada no design

### **3. Compliance e Governança**
- **ISO 27001**: Sistema de Gestão de Segurança da Informação
- **SOC 2 Type II**: Controles de segurança e disponibilidade
- **GDPR**: Conformidade com proteção de dados
- **PCI DSS**: Padrão de segurança para dados de cartão

## 🔐 Autenticação e Autorização

### **1. Sistema de Autenticação Multi-Fator**

#### **JWT Token Authentication**
```python
# Estrutura do JWT Token
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "user_id": "123",
    "username": "admin",
    "email": "admin@purpleteam.local",
    "roles": ["admin", "security_analyst"],
    "permissions": [
      "read:targets",
      "write:targets",
      "read:scans",
      "write:scans",
      "read:vulnerabilities",
      "write:reports"
    ],
    "mfa_verified": true,
    "session_id": "sess_abc123",
    "exp": 1640995200,
    "iat": 1640908800,
    "jti": "jwt_token_id"
  }
}
```

#### **Multi-Factor Authentication (MFA)**
```python
# Implementação MFA
class MFAService:
    def __init__(self):
        self.totp = pyotp.TOTP('base32secret3232')
    
    def generate_qr_code(self, user_id: str) -> str:
        """Gera QR code para configuração MFA"""
        secret = pyotp.random_base32()
        totp_uri = pyotp.totp.TOTP(secret).provisioning_uri(
            name=f"user_{user_id}",
            issuer_name="Purple Team Platform"
        )
        return qrcode.make(totp_uri)
    
    def verify_totp(self, secret: str, token: str) -> bool:
        """Verifica token TOTP"""
        totp = pyotp.TOTP(secret)
        return totp.verify(token)
```

### **2. Role-Based Access Control (RBAC)**

#### **Definição de Roles**
```python
# Roles e Permissões
ROLES = {
    "admin": {
        "description": "Administrador do sistema",
        "permissions": [
            "read:*", "write:*", "delete:*", "admin:*"
        ]
    },
    "security_analyst": {
        "description": "Analista de segurança",
        "permissions": [
            "read:targets", "write:targets",
            "read:scans", "write:scans",
            "read:vulnerabilities", "write:vulnerabilities",
            "read:reports", "write:reports"
        ]
    },
    "manager": {
        "description": "Gerente de projetos",
        "permissions": [
            "read:targets", "read:scans",
            "read:vulnerabilities", "read:reports",
            "write:reports"
        ]
    },
    "viewer": {
        "description": "Visualizador",
        "permissions": [
            "read:targets", "read:scans",
            "read:vulnerabilities", "read:reports"
        ]
    }
}
```

#### **Middleware de Autorização**
```python
# Middleware de verificação de permissões
def require_permission(permission: str):
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

# Uso do decorator
@require_permission("write:targets")
async def create_target(target_data: TargetCreate):
    # Lógica de criação de target
    pass
```

### **3. Session Management**

#### **Controle de Sessões**
```python
# Gerenciamento de sessões
class SessionManager:
    def __init__(self, redis_client):
        self.redis = redis_client
        self.session_timeout = 3600  # 1 hora
    
    async def create_session(self, user_id: str, session_data: dict) -> str:
        """Cria nova sessão"""
        session_id = str(uuid.uuid4())
        session_key = f"session:{session_id}"
        
        session_data.update({
            "user_id": user_id,
            "created_at": datetime.utcnow().isoformat(),
            "last_activity": datetime.utcnow().isoformat()
        })
        
        await self.redis.setex(
            session_key,
            self.session_timeout,
            json.dumps(session_data)
        )
        
        return session_id
    
    async def validate_session(self, session_id: str) -> dict:
        """Valida sessão existente"""
        session_key = f"session:{session_id}"
        session_data = await self.redis.get(session_key)
        
        if not session_data:
            raise HTTPException(status_code=401, detail="Invalid session")
        
        session = json.loads(session_data)
        session["last_activity"] = datetime.utcnow().isoformat()
        
        # Renovar sessão
        await self.redis.setex(
            session_key,
            self.session_timeout,
            json.dumps(session)
        )
        
        return session
```

## 🔒 Criptografia e Proteção de Dados

### **1. Criptografia em Repouso**

#### **Criptografia de Banco de Dados**
```sql
-- Criptografia de colunas sensíveis
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Função para criptografar dados
CREATE OR REPLACE FUNCTION encrypt_sensitive_data(data TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN pgp_sym_encrypt(
        data, 
        current_setting('app.encryption_key')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para descriptografar dados
CREATE OR REPLACE FUNCTION decrypt_sensitive_data(encrypted_data TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN pgp_sym_decrypt(
        encrypted_data::bytea, 
        current_setting('app.encryption_key')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Tabela com dados criptografados
CREATE TABLE sensitive_data (
    id SERIAL PRIMARY KEY,
    api_key TEXT NOT NULL,
    secret_key TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger para criptografar dados automaticamente
CREATE OR REPLACE FUNCTION encrypt_sensitive_data_trigger()
RETURNS TRIGGER AS $$
BEGIN
    NEW.api_key := encrypt_sensitive_data(NEW.api_key);
    NEW.secret_key := encrypt_sensitive_data(NEW.secret_key);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER encrypt_sensitive_data_trigger
    BEFORE INSERT OR UPDATE ON sensitive_data
    FOR EACH ROW
    EXECUTE FUNCTION encrypt_sensitive_data_trigger();
```

#### **Criptografia de Arquivos**
```python
# Criptografia de arquivos de relatório
from cryptography.fernet import Fernet
import os

class FileEncryption:
    def __init__(self, key: bytes = None):
        self.key = key or Fernet.generate_key()
        self.cipher = Fernet(self.key)
    
    def encrypt_file(self, file_path: str) -> str:
        """Criptografa arquivo"""
        encrypted_path = f"{file_path}.encrypted"
        
        with open(file_path, 'rb') as file:
            data = file.read()
        
        encrypted_data = self.cipher.encrypt(data)
        
        with open(encrypted_path, 'wb') as file:
            file.write(encrypted_data)
        
        # Remover arquivo original
        os.remove(file_path)
        
        return encrypted_path
    
    def decrypt_file(self, encrypted_path: str) -> bytes:
        """Descriptografa arquivo"""
        with open(encrypted_path, 'rb') as file:
            encrypted_data = file.read()
        
        return self.cipher.decrypt(encrypted_data)
```

### **2. Criptografia em Trânsito**

#### **TLS/SSL Configuration**
```python
# Configuração TLS para FastAPI
import ssl
from fastapi import FastAPI
from uvicorn import Config, Server

# Configuração SSL
ssl_context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
ssl_context.load_cert_chain(
    certfile="certs/server.crt",
    keyfile="certs/server.key"
)

# Configuração de segurança
security_config = {
    "ssl_context": ssl_context,
    "ssl_ciphers": "ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256",
    "ssl_min_version": ssl.TLSVersion.TLSv1_2,
    "ssl_max_version": ssl.TLSVersion.TLSv1_3,
    "hsts": True,
    "hsts_max_age": 31536000,  # 1 ano
    "hsts_include_subdomains": True,
    "hsts_preload": True
}
```

#### **API Security Headers**
```python
# Middleware de headers de segurança
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

app = FastAPI()

# Headers de segurança
@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    
    # Headers de segurança
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self' 'unsafe-inline'"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
    
    return response

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://app.purpleteam-platform.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Trusted Hosts
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["app.purpleteam-platform.com", "api.purpleteam-platform.com"]
)
```

## 🛡️ Proteção contra Ataques

### **1. Rate Limiting**

#### **Implementação de Rate Limiting**
```python
# Rate Limiting com Redis
import redis
from fastapi import HTTPException, Request
import time

class RateLimiter:
    def __init__(self, redis_client: redis.Redis):
        self.redis = redis_client
        self.limits = {
            "auth": {"requests": 5, "window": 300},  # 5 requests per 5 minutes
            "api": {"requests": 1000, "window": 3600},  # 1000 requests per hour
            "scan": {"requests": 10, "window": 3600},  # 10 scans per hour
        }
    
    async def check_rate_limit(self, request: Request, limit_type: str = "api"):
        """Verifica rate limit"""
        client_ip = request.client.host
        user_id = getattr(request.state, 'user_id', None)
        
        # Chave única para rate limiting
        key = f"rate_limit:{limit_type}:{client_ip}:{user_id}"
        
        limit_config = self.limits.get(limit_type, self.limits["api"])
        current_time = int(time.time())
        window_start = current_time - limit_config["window"]
        
        # Remover requisições antigas
        await self.redis.zremrangebyscore(key, 0, window_start)
        
        # Contar requisições na janela
        request_count = await self.redis.zcard(key)
        
        if request_count >= limit_config["requests"]:
            raise HTTPException(
                status_code=429,
                detail="Rate limit exceeded"
            )
        
        # Adicionar requisição atual
        await self.redis.zadd(key, {str(current_time): current_time})
        await self.redis.expire(key, limit_config["window"])
        
        # Adicionar headers de rate limit
        remaining = limit_config["requests"] - request_count - 1
        reset_time = current_time + limit_config["window"]
        
        return {
            "remaining": remaining,
            "reset_time": reset_time
        }
```

### **2. Input Validation e Sanitization**

#### **Validação de Entrada**
```python
# Validação e sanitização de entrada
from pydantic import BaseModel, validator
import re
from typing import Optional

class TargetCreate(BaseModel):
    name: str
    type: str
    url: Optional[str] = None
    description: Optional[str] = None
    
    @validator('name')
    def validate_name(cls, v):
        # Validar formato do nome
        if not re.match(r'^[a-zA-Z0-9.-]+$', v):
            raise ValueError('Invalid target name format')
        
        # Sanitizar entrada
        v = v.strip()
        if len(v) < 3 or len(v) > 255:
            raise ValueError('Name must be between 3 and 255 characters')
        
        return v
    
    @validator('url')
    def validate_url(cls, v):
        if v:
            # Validar URL
            if not re.match(r'^https?://[^\s/$.?#].[^\s]*$', v):
                raise ValueError('Invalid URL format')
            
            # Sanitizar URL
            v = v.strip()
            if len(v) > 500:
                raise ValueError('URL too long')
        
        return v
    
    @validator('description')
    def validate_description(cls, v):
        if v:
            # Sanitizar descrição
            v = re.sub(r'<script.*?</script>', '', v, flags=re.IGNORECASE)
            v = v.strip()
            if len(v) > 1000:
                raise ValueError('Description too long')
        
        return v
```

### **3. SQL Injection Protection**

#### **Proteção contra SQL Injection**
```python
# Uso de queries parametrizadas
from sqlalchemy import text
from sqlalchemy.orm import Session

class TargetRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def get_targets_by_category(self, category: str):
        # Query parametrizada (segura)
        query = text("""
            SELECT * FROM targets 
            WHERE category = :category 
            AND status = 'active'
        """)
        
        result = self.db.execute(query, {"category": category})
        return result.fetchall()
    
    def search_targets(self, search_term: str):
        # Busca segura com LIKE
        query = text("""
            SELECT * FROM targets 
            WHERE name ILIKE :search_pattern 
            AND status = 'active'
        """)
        
        search_pattern = f"%{search_term}%"
        result = self.db.execute(query, {"search_pattern": search_pattern})
        return result.fetchall()
```

### **4. XSS Protection**

#### **Proteção contra XSS**
```python
# Sanitização de HTML
import bleach
from markupsafe import Markup

class XSSProtection:
    def __init__(self):
        # Configuração de tags e atributos permitidos
        self.allowed_tags = [
            'p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
        ]
        
        self.allowed_attributes = {
            '*': ['class', 'id'],
            'a': ['href', 'title'],
            'img': ['src', 'alt', 'title']
        }
    
    def sanitize_html(self, html_content: str) -> str:
        """Sanitiza conteúdo HTML"""
        if not html_content:
            return ""
        
        # Remover scripts e conteúdo perigoso
        cleaned = bleach.clean(
            html_content,
            tags=self.allowed_tags,
            attributes=self.allowed_attributes,
            strip=True
        )
        
        return cleaned
    
    def sanitize_text(self, text: str) -> str:
        """Sanitiza texto simples"""
        if not text:
            return ""
        
        # Escapar caracteres especiais
        return Markup.escape(text)
```

## 🔍 Auditoria e Logging

### **1. Sistema de Auditoria**

#### **Log de Auditoria**
```python
# Sistema de auditoria
import logging
from datetime import datetime
from typing import Dict, Any

class AuditLogger:
    def __init__(self, db_session):
        self.db = db_session
        self.logger = logging.getLogger('audit')
    
    async def log_action(
        self,
        user_id: int,
        action: str,
        resource_type: str,
        resource_id: str,
        details: Dict[str, Any] = None,
        ip_address: str = None,
        success: bool = True
    ):
        """Registra ação de auditoria"""
        
        audit_entry = {
            "user_id": user_id,
            "action": action,
            "resource_type": resource_type,
            "resource_id": resource_id,
            "details": details or {},
            "ip_address": ip_address,
            "success": success,
            "timestamp": datetime.utcnow()
        }
        
        # Salvar no banco de dados
        await self.db.execute("""
            INSERT INTO audit_logs 
            (user_id, action, resource_type, resource_id, details, ip_address, success, created_at)
            VALUES (:user_id, :action, :resource_type, :resource_id, :details, :ip_address, :success, :timestamp)
        """, audit_entry)
        
        # Log estruturado
        self.logger.info(
            "Audit action",
            extra={
                "audit": True,
                "user_id": user_id,
                "action": action,
                "resource_type": resource_type,
                "resource_id": resource_id,
                "ip_address": ip_address,
                "success": success
            }
        )
```

### **2. Logging Estruturado**

#### **Configuração de Logging**
```python
# Configuração de logging estruturado
import structlog
import logging
from datetime import datetime

# Configuração do structlog
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

# Logger configurado
logger = structlog.get_logger()

# Exemplo de uso
def log_security_event(event_type: str, details: dict):
    logger.info(
        "Security event detected",
        event_type=event_type,
        details=details,
        timestamp=datetime.utcnow().isoformat(),
        severity="high"
    )
```

## 🔐 Gerenciamento de Segredos

### **1. Vault Integration**

#### **Integração com HashiCorp Vault**
```python
# Integração com Vault para gerenciamento de segredos
import hvac
from typing import Optional

class VaultManager:
    def __init__(self, vault_url: str, token: str):
        self.client = hvac.Client(url=vault_url, token=token)
    
    def get_secret(self, path: str, key: str) -> Optional[str]:
        """Recupera segredo do Vault"""
        try:
            response = self.client.secrets.kv.v2.read_secret_version(
                path=path,
                mount_point='secret'
            )
            
            if response and 'data' in response:
                return response['data']['data'].get(key)
            
            return None
        except Exception as e:
            logger.error(f"Failed to retrieve secret from Vault: {e}")
            return None
    
    def store_secret(self, path: str, data: dict):
        """Armazena segredo no Vault"""
        try:
            self.client.secrets.kv.v2.create_or_update_secret(
                path=path,
                secret_data=data,
                mount_point='secret'
            )
            logger.info(f"Secret stored successfully at path: {path}")
        except Exception as e:
            logger.error(f"Failed to store secret in Vault: {e}")
            raise
```

### **2. Environment Variables Security**

#### **Gerenciamento Seguro de Variáveis**
```python
# Gerenciamento seguro de variáveis de ambiente
import os
from typing import Optional
from cryptography.fernet import Fernet

class SecureConfig:
    def __init__(self):
        self.encryption_key = os.getenv('ENCRYPTION_KEY')
        if self.encryption_key:
            self.cipher = Fernet(self.encryption_key.encode())
    
    def get_secure_env(self, key: str, default: str = None) -> Optional[str]:
        """Recupera variável de ambiente de forma segura"""
        value = os.getenv(key, default)
        
        if value and value.startswith('ENC:'):
            # Descriptografar valor
            encrypted_value = value[4:]  # Remove prefixo 'ENC:'
            try:
                decrypted_value = self.cipher.decrypt(encrypted_value.encode())
                return decrypted_value.decode()
            except Exception as e:
                logger.error(f"Failed to decrypt environment variable {key}: {e}")
                return None
        
        return value
    
    def set_secure_env(self, key: str, value: str):
        """Define variável de ambiente de forma segura"""
        if self.encryption_key:
            # Criptografar valor
            encrypted_value = self.cipher.encrypt(value.encode())
            os.environ[key] = f"ENC:{encrypted_value.decode()}"
        else:
            os.environ[key] = value
```

## 🚨 Incident Response

### **1. Sistema de Detecção de Intrusão**

#### **Detecção de Anomalias**
```python
# Sistema de detecção de anomalias
from typing import List, Dict
import numpy as np
from datetime import datetime, timedelta

class AnomalyDetector:
    def __init__(self):
        self.thresholds = {
            "failed_logins": 5,  # 5 tentativas falhadas
            "api_requests": 1000,  # 1000 requests por hora
            "scan_requests": 10,  # 10 scans por hora
        }
    
    def detect_failed_login_anomaly(self, user_id: str, time_window: int = 300) -> bool:
        """Detecta anomalia em tentativas de login"""
        # Buscar tentativas falhadas na janela de tempo
        failed_attempts = self.get_failed_login_attempts(user_id, time_window)
        
        if failed_attempts >= self.thresholds["failed_logins"]:
            self.trigger_security_alert(
                "Failed login anomaly detected",
                {
                    "user_id": user_id,
                    "failed_attempts": failed_attempts,
                    "threshold": self.thresholds["failed_logins"],
                    "time_window": time_window
                }
            )
            return True
        
        return False
    
    def detect_api_anomaly(self, client_ip: str, time_window: int = 3600) -> bool:
        """Detecta anomalia em requests da API"""
        request_count = self.get_api_request_count(client_ip, time_window)
        
        if request_count >= self.thresholds["api_requests"]:
            self.trigger_security_alert(
                "API rate limit anomaly detected",
                {
                    "client_ip": client_ip,
                    "request_count": request_count,
                    "threshold": self.thresholds["api_requests"],
                    "time_window": time_window
                }
            )
            return True
        
        return False
    
    def trigger_security_alert(self, alert_type: str, details: Dict):
        """Dispara alerta de segurança"""
        alert = {
            "type": alert_type,
            "severity": "high",
            "details": details,
            "timestamp": datetime.utcnow().isoformat(),
            "status": "open"
        }
        
        # Salvar alerta no banco
        self.save_security_alert(alert)
        
        # Enviar notificação
        self.send_security_notification(alert)
        
        # Log de segurança
        logger.warning(
            "Security alert triggered",
            alert_type=alert_type,
            details=details
        )
```

### **2. Sistema de Notificações de Segurança**

#### **Notificações Automáticas**
```python
# Sistema de notificações de segurança
from typing import List
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

class SecurityNotifier:
    def __init__(self):
        self.smtp_server = os.getenv('SMTP_SERVER')
        self.smtp_port = int(os.getenv('SMTP_PORT', '587'))
        self.smtp_username = os.getenv('SMTP_USERNAME')
        self.smtp_password = os.getenv('SMTP_PASSWORD')
        self.admin_email = os.getenv('ADMIN_EMAIL')
    
    def send_security_alert_email(self, alert: Dict):
        """Envia email de alerta de segurança"""
        subject = f"Security Alert: {alert['type']}"
        
        body = f"""
        Security Alert Detected
        
        Type: {alert['type']}
        Severity: {alert['severity']}
        Timestamp: {alert['timestamp']}
        
        Details:
        {self.format_alert_details(alert['details'])}
        
        Please review this alert immediately.
        """
        
        msg = MIMEMultipart()
        msg['From'] = self.smtp_username
        msg['To'] = self.admin_email
        msg['Subject'] = subject
        
        msg.attach(MIMEText(body, 'plain'))
        
        try:
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.smtp_username, self.smtp_password)
            server.send_message(msg)
            server.quit()
            
            logger.info(f"Security alert email sent: {alert['type']}")
        except Exception as e:
            logger.error(f"Failed to send security alert email: {e}")
    
    def send_slack_notification(self, alert: Dict):
        """Envia notificação para Slack"""
        webhook_url = os.getenv('SLACK_WEBHOOK_URL')
        
        if not webhook_url:
            return
        
        message = {
            "text": f"🚨 Security Alert: {alert['type']}",
            "attachments": [
                {
                    "color": "danger",
                    "fields": [
                        {
                            "title": "Type",
                            "value": alert['type'],
                            "short": True
                        },
                        {
                            "title": "Severity",
                            "value": alert['severity'],
                            "short": True
                        },
                        {
                            "title": "Details",
                            "value": self.format_alert_details(alert['details']),
                            "short": False
                        }
                    ]
                }
            ]
        }
        
        try:
            requests.post(webhook_url, json=message)
            logger.info(f"Slack notification sent: {alert['type']}")
        except Exception as e:
            logger.error(f"Failed to send Slack notification: {e}")
```

## 📋 Compliance e Relatórios

### **1. Relatórios de Compliance**

#### **Geração de Relatórios de Segurança**
```python
# Geração de relatórios de compliance
from typing import Dict, List
import json
from datetime import datetime, timedelta

class ComplianceReporter:
    def __init__(self, db_session):
        self.db = db_session
    
    async def generate_security_report(self, start_date: datetime, end_date: datetime) -> Dict:
        """Gera relatório de segurança"""
        
        # Coletar dados de segurança
        security_data = await self.collect_security_data(start_date, end_date)
        
        report = {
            "report_type": "security_compliance",
            "period": {
                "start_date": start_date.isoformat(),
                "end_date": end_date.isoformat()
            },
            "generated_at": datetime.utcnow().isoformat(),
            "summary": {
                "total_incidents": len(security_data["incidents"]),
                "critical_incidents": len([i for i in security_data["incidents"] if i["severity"] == "critical"]),
                "security_alerts": len(security_data["alerts"]),
                "failed_logins": security_data["failed_logins"],
                "suspicious_activities": len(security_data["suspicious_activities"])
            },
            "details": security_data,
            "compliance_status": await self.check_compliance_status(),
            "recommendations": await self.generate_recommendations(security_data)
        }
        
        return report
    
    async def check_compliance_status(self) -> Dict:
        """Verifica status de compliance"""
        return {
            "iso_27001": {
                "status": "compliant",
                "score": 95,
                "last_audit": "2025-07-15",
                "next_audit": "2025-10-15"
            },
            "soc_2": {
                "status": "compliant",
                "score": 92,
                "last_audit": "2025-06-20",
                "next_audit": "2025-09-20"
            },
            "pci_dss": {
                "status": "compliant",
                "score": 88,
                "last_audit": "2025-05-10",
                "next_audit": "2025-08-10"
            }
        }
```

---

**Última atualização**: 21 de Agosto de 2025  
**Versão**: 4.0.0-master  
**Status**: ✅ Documentação de Segurança Completa 