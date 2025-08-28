# ⚙️ Securet Flow SSC - Configuration Documentation

## 🔧 Visão Geral de Configuração

Este guia abrange todas as configurações do **Securet Flow SSC**, incluindo variáveis de ambiente, configurações de segurança, monitoramento, integrações e personalização do sistema.

## 📋 Estrutura de Configuração

### **Arquivos de Configuração**
```yaml
Configuration Files:
  Environment Variables:
    - .env (local development)
    - .env.production (production)
    - .env.staging (staging)
  
  Application Configs:
    - config.py (backend configuration)
    - vite.config.ts (frontend configuration)
    - tailwind.config.js (styling configuration)
  
  Service Configs:
    - kong.yml (API Gateway)
    - prometheus.yml (monitoring)
    - grafana.ini (dashboards)
    - nginx.conf (web server)
  
  Security Configs:
    - security.yml (security policies)
    - ssl.conf (SSL/TLS configuration)
    - firewall.rules (network security)
```

## 🌍 Variáveis de Ambiente

### **Configuração Base**
```bash
# .env.example
# ========================================
# SECURET FLOW SSC - ENVIRONMENT CONFIG
# ========================================

# Application Configuration
ENVIRONMENT=production
DEBUG=false
LOG_LEVEL=info
SECRET_KEY=your-super-secret-key-here
API_HOST=0.0.0.0
API_PORT=8000
FRONTEND_PORT=3000

# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/securet_flow
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=securet_flow
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-secure-password

# Cache Configuration
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your-redis-password
REDIS_DB=0

# Search Configuration
ELASTICSEARCH_URL=http://localhost:9200
ELASTICSEARCH_USERNAME=elastic
ELASTICSEARCH_PASSWORD=your-elastic-password

# Storage Configuration
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=your-minio-secret
MINIO_BUCKET=securet-flow

# Authentication Configuration
JWT_SECRET_KEY=your-jwt-secret-key
JWT_ALGORITHM=HS256
JWT_EXPIRATION=3600
JWT_REFRESH_EXPIRATION=86400
MFA_ENABLED=true

# AI Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:latest
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key

# External APIs
SHODAN_API_KEY=your-shodan-api-key
VIRUSTOTAL_API_KEY=your-virustotal-api-key
CENSYS_API_KEY=your-censys-api-key

# Monitoring Configuration
PROMETHEUS_PORT=9090
GRAFANA_PORT=3001
GRAFANA_PASSWORD=your-grafana-password
LOKI_PORT=3100

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@securet-flow.com

# Integration Configuration
DISCORD_TOKEN=your-discord-bot-token
SLACK_BOT_TOKEN=your-slack-bot-token
TELEGRAM_TOKEN=your-telegram-bot-token

# Security Configuration
CORS_ORIGINS=https://app.securet-flow.com,https://api.securet-flow.com
RATE_LIMIT_REQUESTS=1000
RATE_LIMIT_WINDOW=3600
SESSION_TIMEOUT=3600

# Backup Configuration
BACKUP_ENABLED=true
BACKUP_SCHEDULE=0 2 * * *
BACKUP_RETENTION_DAYS=30
BACKUP_S3_BUCKET=securet-flow-backups

# Feature Flags
FEATURE_AI_ANALYSIS=true
FEATURE_VTUBER=true
FEATURE_CHATBOT=true
FEATURE_PREDICTIVE_ANALYTICS=true
```

### **Configuração por Ambiente**

#### **Desenvolvimento (.env.development)**
```bash
# Development Environment
ENVIRONMENT=development
DEBUG=true
LOG_LEVEL=debug
API_HOST=localhost
API_PORT=8000
FRONTEND_PORT=3000

# Development Database
DATABASE_URL=postgresql://postgres:dev_password@localhost:5432/securet_flow_dev
POSTGRES_PASSWORD=dev_password

# Development Cache
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=dev_redis_password

# Development AI
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:latest

# Development Monitoring
PROMETHEUS_PORT=9090
GRAFANA_PORT=3001
GRAFANA_PASSWORD=dev_grafana_password

# Development Features
FEATURE_AI_ANALYSIS=true
FEATURE_VTUBER=true
FEATURE_CHATBOT=true
```

#### **Staging (.env.staging)**
```bash
# Staging Environment
ENVIRONMENT=staging
DEBUG=false
LOG_LEVEL=info
API_HOST=0.0.0.0
API_PORT=8000

# Staging Database
DATABASE_URL=postgresql://postgres:staging_password@staging-db:5432/securet_flow_staging
POSTGRES_PASSWORD=staging_password

# Staging Cache
REDIS_URL=redis://staging-redis:6379
REDIS_PASSWORD=staging_redis_password

# Staging AI
OLLAMA_BASE_URL=http://staging-ollama:11434
OPENAI_API_KEY=your-openai-api-key

# Staging Monitoring
PROMETHEUS_PORT=9090
GRAFANA_PORT=3001
GRAFANA_PASSWORD=staging_grafana_password

# Staging Security
CORS_ORIGINS=https://staging.securet-flow.com
RATE_LIMIT_REQUESTS=500
```

#### **Produção (.env.production)**
```bash
# Production Environment
ENVIRONMENT=production
DEBUG=false
LOG_LEVEL=warn
API_HOST=0.0.0.0
API_PORT=8000

# Production Database
DATABASE_URL=postgresql://postgres:prod_password@prod-db:5432/securet_flow_prod
POSTGRES_PASSWORD=prod_password

# Production Cache
REDIS_URL=redis://prod-redis:6379
REDIS_PASSWORD=prod_redis_password

# Production AI
OLLAMA_BASE_URL=http://prod-ollama:11434
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key

# Production Monitoring
PROMETHEUS_PORT=9090
GRAFANA_PORT=3001
GRAFANA_PASSWORD=prod_grafana_password

# Production Security
CORS_ORIGINS=https://app.securet-flow.com,https://api.securet-flow.com
RATE_LIMIT_REQUESTS=1000
SESSION_TIMEOUT=3600

# Production Backup
BACKUP_ENABLED=true
BACKUP_SCHEDULE=0 2 * * *
BACKUP_RETENTION_DAYS=90
```

## 🔐 Configuração de Segurança

### **Security Configuration**
```yaml
# security.yml
security:
  authentication:
    jwt:
      secret_key: ${JWT_SECRET_KEY}
      algorithm: ${JWT_ALGORITHM}
      expiration: ${JWT_EXPIRATION}
      refresh_expiration: ${JWT_REFRESH_EXPIRATION}
    
    mfa:
      enabled: ${MFA_ENABLED}
      totp_issuer: "Securet Flow SSC"
      backup_codes_count: 10
    
    password_policy:
      min_length: 12
      require_uppercase: true
      require_lowercase: true
      require_numbers: true
      require_special_chars: true
      max_age_days: 90
  
  authorization:
    rbac:
      enabled: true
      default_role: "viewer"
      roles:
        admin:
          permissions: ["*"]
        security_analyst:
          permissions: ["read:*", "write:targets", "write:scans", "write:vulnerabilities"]
        manager:
          permissions: ["read:*", "write:reports"]
        viewer:
          permissions: ["read:*"]
  
  network:
    cors:
      origins: ${CORS_ORIGINS}
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
      headers: ["*"]
      credentials: true
    
    rate_limiting:
      enabled: true
      requests_per_hour: ${RATE_LIMIT_REQUESTS}
      window_seconds: ${RATE_LIMIT_WINDOW}
    
    ip_whitelist:
      enabled: false
      ips: []
  
  encryption:
    database:
      enabled: true
      algorithm: "AES-256-GCM"
    
    storage:
      enabled: true
      algorithm: "AES-256-GCM"
    
    backups:
      enabled: true
      algorithm: "AES-256-GCM"
  
  audit:
    logging:
      enabled: true
      level: "INFO"
      retention_days: 365
    
    events:
      - user_login
      - user_logout
      - target_created
      - target_updated
      - scan_started
      - scan_completed
      - vulnerability_found
      - report_generated
```

### **SSL/TLS Configuration**
```nginx
# ssl.conf
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256;
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;

# HSTS
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

# Security Headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
```

## 📊 Configuração de Monitoramento

### **Prometheus Configuration**
```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alert_rules.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093

scrape_configs:
  - job_name: 'securet-backend'
    static_configs:
      - targets: ['backend:8000']
    metrics_path: '/metrics'
    scrape_interval: 30s
    scrape_timeout: 10s

  - job_name: 'securet-frontend'
    static_configs:
      - targets: ['frontend:80']
    metrics_path: '/metrics'
    scrape_interval: 30s

  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres:5432']
    scrape_interval: 60s

  - job_name: 'redis'
    static_configs:
      - targets: ['redis:6379']
    scrape_interval: 60s

  - job_name: 'elasticsearch'
    static_configs:
      - targets: ['elasticsearch:9200']
    scrape_interval: 60s

  - job_name: 'ollama'
    static_configs:
      - targets: ['ollama:11434']
    scrape_interval: 60s
```

### **Grafana Configuration**
```ini
# grafana.ini
[server]
protocol = http
http_port = 3000
domain = localhost
root_url = %(protocol)s://%(domain)s:%(http_port)s/
serve_from_sub_path = false

[database]
type = sqlite3
path = /var/lib/grafana/grafana.db

[security]
admin_user = admin
admin_password = ${GRAFANA_PASSWORD}
disable_initial_admin_creation = false

[smtp]
enabled = true
host = ${SMTP_HOST}:${SMTP_PORT}
user = ${SMTP_USERNAME}
password = ${SMTP_PASSWORD}
from_address = ${EMAIL_FROM}
from_name = Securet Flow SSC

[alerting]
enabled = true
execute_alerts = true

[unified_alerting]
enabled = true

[log]
mode = console
level = info
```

### **Alert Rules**
```yaml
# alert_rules.yml
groups:
  - name: securet-flow-alerts
    rules:
      - alert: HighCPUUsage
        expr: rate(process_cpu_seconds_total[5m]) * 100 > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage detected"
          description: "CPU usage is above 80% for 5 minutes"

      - alert: HighMemoryUsage
        expr: (process_resident_memory_bytes / container_memory_usage_bytes) * 100 > 85
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage detected"
          description: "Memory usage is above 85% for 5 minutes"

      - alert: DatabaseConnectionError
        expr: pg_up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Database connection failed"
          description: "Cannot connect to PostgreSQL database"

      - alert: RedisConnectionError
        expr: redis_up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Redis connection failed"
          description: "Cannot connect to Redis cache"

      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High error rate detected"
          description: "Error rate is above 5% for 5 minutes"

      - alert: ScanFailure
        expr: securet_scan_failures_total > 0
        for: 1m
        labels:
          severity: warning
        annotations:
          summary: "Scan failures detected"
          description: "Security scans are failing"

      - alert: CriticalVulnerabilities
        expr: securet_vulnerabilities_total{severity="critical"} > 10
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Critical vulnerabilities detected"
          description: "More than 10 critical vulnerabilities found"
```

## 🔗 Configuração de Integrações

### **Discord Integration**
```yaml
# discord.yml
discord:
  enabled: true
  token: ${DISCORD_TOKEN}
  guild_id: "your-guild-id"
  channels:
    alerts: "security-alerts"
    notifications: "general"
    reports: "security-reports"
  
  notifications:
    critical_vulnerabilities: true
    scan_completed: true
    system_alerts: true
    weekly_reports: true
  
  commands:
    - name: "scan"
      description: "Start a security scan"
      enabled: true
    
    - name: "status"
      description: "Check system status"
      enabled: true
    
    - name: "report"
      description: "Generate security report"
      enabled: true
```

### **Slack Integration**
```yaml
# slack.yml
slack:
  enabled: true
  bot_token: ${SLACK_BOT_TOKEN}
  app_token: ${SLACK_APP_TOKEN}
  channels:
    alerts: "#security-alerts"
    notifications: "#general"
    reports: "#security-reports"
  
  notifications:
    critical_vulnerabilities: true
    scan_completed: true
    system_alerts: true
    weekly_reports: true
  
  slash_commands:
    - command: "/securet-scan"
      description: "Start a security scan"
      enabled: true
    
    - command: "/securet-status"
      description: "Check system status"
      enabled: true
    
    - command: "/securet-report"
      description: "Generate security report"
      enabled: true
```

### **Email Configuration**
```yaml
# email.yml
email:
  smtp:
    host: ${SMTP_HOST}
    port: ${SMTP_PORT}
    username: ${SMTP_USERNAME}
    password: ${SMTP_PASSWORD}
    use_tls: true
    use_ssl: false
  
  from:
    address: ${EMAIL_FROM}
    name: "Securet Flow SSC"
  
  templates:
    alert:
      subject: "Security Alert - {alert_type}"
      template: "alerts/security_alert.html"
    
    report:
      subject: "Security Report - {report_type}"
      template: "reports/security_report.html"
    
    notification:
      subject: "Security Notification - {notification_type}"
      template: "notifications/security_notification.html"
  
  recipients:
    admins:
      - "admin@company.com"
      - "security@company.com"
    
    managers:
      - "manager@company.com"
    
    analysts:
      - "analyst@company.com"
```

## 🎨 Configuração de UI/UX

### **Frontend Configuration**
```typescript
// config/frontend.ts
export const frontendConfig = {
  // API Configuration
  api: {
    baseUrl: process.env.API_BASE_URL || 'http://localhost:8000',
    timeout: 30000,
    retries: 3,
  },

  // Theme Configuration
  theme: {
    defaultTheme: 'dark',
    themes: {
      light: {
        primary: '#3b82f6',
        secondary: '#6b7280',
        background: '#ffffff',
        surface: '#f9fafb',
        text: '#111827',
      },
      dark: {
        primary: '#3b82f6',
        secondary: '#9ca3af',
        background: '#111827',
        surface: '#1f2937',
        text: '#f9fafb',
      },
    },
  },

  // Feature Flags
  features: {
    aiAnalysis: process.env.FEATURE_AI_ANALYSIS === 'true',
    vtuber: process.env.FEATURE_VTUBER === 'true',
    chatbot: process.env.FEATURE_CHATBOT === 'true',
    predictiveAnalytics: process.env.FEATURE_PREDICTIVE_ANALYTICS === 'true',
  },

  // Security Configuration
  security: {
    sessionTimeout: parseInt(process.env.SESSION_TIMEOUT || '3600'),
    mfaEnabled: process.env.MFA_ENABLED === 'true',
    passwordPolicy: {
      minLength: 12,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    },
  },

  // Monitoring Configuration
  monitoring: {
    enabled: true,
    endpoint: process.env.MONITORING_ENDPOINT || '/metrics',
    interval: 30000,
  },
};
```

### **Tailwind Configuration**
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        security: {
          low: '#10b981',
          medium: '#f59e0b',
          high: '#ef4444',
          critical: '#7c2d12',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

## 🔄 Configuração de Backup

### **Backup Configuration**
```yaml
# backup.yml
backup:
  enabled: ${BACKUP_ENABLED}
  schedule: ${BACKUP_SCHEDULE}
  retention:
    days: ${BACKUP_RETENTION_DAYS}
    max_backups: 30
  
  storage:
    type: "s3"
    bucket: ${BACKUP_S3_BUCKET}
    region: "us-east-1"
    encryption: true
  
  components:
    database:
      enabled: true
      type: "postgresql"
      compression: true
    
    files:
      enabled: true
      paths:
        - "/app/uploads"
        - "/app/reports"
        - "/app/logs"
      compression: true
    
    configuration:
      enabled: true
      paths:
        - "/app/config"
        - "/app/ssl"
      compression: true
  
  notifications:
    email:
      enabled: true
      recipients:
        - "admin@company.com"
    
    slack:
      enabled: true
      channel: "#backups"
    
    discord:
      enabled: true
      channel: "backups"
```

## 📚 Documentação Adicional

### **Links Úteis**
- [🔐 Configurações de Segurança](security.md)
- [📊 Configurações de Monitoramento](monitoring.md)
- [🔗 Configurações de Integração](integrations.md)
- [🎨 Configurações de UI](ui-config.md)

### **APIs**
- [📊 API Configuration](../api/README.md)
- [🔧 Backend Configuration](../backend/README.md)

### **Ferramentas**
- [🛠️ Ferramentas de Configuração](../tools/README.md)

---

**Última atualização**: 27 de Agosto de 2025  
**Versão**: 4.0.0-master  
**Status**: ✅ **Documentação de Configuração Completa** 