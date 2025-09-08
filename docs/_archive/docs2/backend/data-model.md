# Purple Team Platform V4 Master - Modelo de Dados

## 🗄️ Visão Geral do Modelo de Dados

O modelo de dados da Purple Team Platform V4 Master é projetado para suportar operações enterprise-grade de security testing, com foco em escalabilidade, performance e integridade dos dados.

## 🏗️ Arquitetura do Banco de Dados

### **1. PostgreSQL (Primary Database)**
```sql
-- Configuração do banco
CREATE DATABASE purpleteam
    WITH 
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    TEMPLATE = template0;

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";
```

### **2. Redis (Cache & Session)**
```redis
# Estrutura de chaves
user:session:{user_id}     -- Sessões de usuário
target:cache:{target_id}   -- Cache de targets
scan:progress:{scan_id}    -- Progresso de scans
api:rate_limit:{ip}        -- Rate limiting
```

### **3. Elasticsearch (Search & Analytics)**
```json
{
  "indices": {
    "vulnerabilities": "Busca e análise de vulnerabilidades",
    "scan_results": "Resultados de scans",
    "audit_logs": "Logs de auditoria",
    "system_metrics": "Métricas do sistema"
  }
}
```

## 📊 Esquema do Banco de Dados

### **1. Tabela de Usuários (users)**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'security_analyst', 'manager', 'viewer')),
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    mfa_enabled BOOLEAN DEFAULT false,
    mfa_secret VARCHAR(255),
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    updated_by INTEGER REFERENCES users(id)
);

-- Índices
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);
CREATE INDEX idx_users_created_at ON users(created_at);
```

### **2. Tabela de Targets (targets)**
```sql
CREATE TABLE targets (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('web', 'api', 'network', 'mobile', 'cloud', 'iot')),
    url VARCHAR(500),
    network_range VARCHAR(100),
    ip_addresses INET[],
    domain VARCHAR(255),
    category VARCHAR(50) NOT NULL CHECK (category IN ('production', 'development', 'staging', 'testing', 'internal')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived', 'quarantine')),
    risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
    tags TEXT[],
    description TEXT,
    owner_id INTEGER REFERENCES users(id),
    business_unit VARCHAR(100),
    compliance TEXT[],
    environment VARCHAR(50) CHECK (environment IN ('production', 'staging', 'development', 'testing')),
    criticality VARCHAR(20) DEFAULT 'medium' CHECK (criticality IN ('low', 'medium', 'high', 'critical')),
    scan_frequency VARCHAR(20) DEFAULT 'weekly' CHECK (scan_frequency IN ('daily', 'weekly', 'monthly', 'quarterly')),
    last_scan TIMESTAMP,
    next_scan TIMESTAMP,
    scan_config JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    updated_by INTEGER REFERENCES users(id)
);

-- Índices
CREATE INDEX idx_targets_name ON targets(name);
CREATE INDEX idx_targets_type ON targets(type);
CREATE INDEX idx_targets_category ON targets(category);
CREATE INDEX idx_targets_status ON targets(status);
CREATE INDEX idx_targets_risk_score ON targets(risk_score);
CREATE INDEX idx_targets_owner_id ON targets(owner_id);
CREATE INDEX idx_targets_business_unit ON targets(business_unit);
CREATE INDEX idx_targets_tags ON targets USING GIN(tags);
CREATE INDEX idx_targets_compliance ON targets USING GIN(compliance);
CREATE INDEX idx_targets_created_at ON targets(created_at);
CREATE INDEX idx_targets_last_scan ON targets(last_scan);
```

### **3. Tabela de Scans (scans)**
```sql
CREATE TABLE scans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_id INTEGER REFERENCES targets(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    scan_type VARCHAR(50) NOT NULL CHECK (scan_type IN ('vulnerability', 'port', 'web', 'api', 'network', 'cloud', 'custom')),
    status VARCHAR(50) DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'paused', 'completed', 'failed', 'cancelled')),
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'critical')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    tools TEXT[],
    scan_config JSONB DEFAULT '{}',
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    duration INTERVAL,
    results JSONB,
    summary JSONB,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    scheduled_at TIMESTAMP,
    scheduled_by INTEGER REFERENCES users(id),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_scans_target_id ON scans(target_id);
CREATE INDEX idx_scans_scan_type ON scans(scan_type);
CREATE INDEX idx_scans_status ON scans(status);
CREATE INDEX idx_scans_priority ON scans(priority);
CREATE INDEX idx_scans_started_at ON scans(started_at);
CREATE INDEX idx_scans_completed_at ON scans(completed_at);
CREATE INDEX idx_scans_created_by ON scans(created_by);
CREATE INDEX idx_scans_scheduled_at ON scans(scheduled_at);
CREATE INDEX idx_scans_tools ON scans USING GIN(tools);
```

### **4. Tabela de Vulnerabilidades (vulnerabilities)**
```sql
CREATE TABLE vulnerabilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scan_id UUID REFERENCES scans(id) ON DELETE CASCADE,
    target_id INTEGER REFERENCES targets(id) ON DELETE CASCADE,
    external_id VARCHAR(255),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('info', 'low', 'medium', 'high', 'critical')),
    cvss_score DECIMAL(3,1) CHECK (cvss_score >= 0.0 AND cvss_score <= 10.0),
    cvss_vector VARCHAR(100),
    location VARCHAR(500),
    endpoint VARCHAR(500),
    parameter VARCHAR(255),
    payload TEXT,
    evidence TEXT,
    tool_detected VARCHAR(100),
    cwe_id VARCHAR(20),
    cve_id VARCHAR(20),
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'open', 'in_progress', 'fixed', 'verified', 'false_positive', 'accepted')),
    false_positive BOOLEAN DEFAULT false,
    verified BOOLEAN DEFAULT false,
    verified_by INTEGER REFERENCES users(id),
    verified_at TIMESTAMP,
    remediation TEXT,
    remediation_priority VARCHAR(20) DEFAULT 'medium' CHECK (remediation_priority IN ('low', 'medium', 'high', 'critical')),
    remediation_effort VARCHAR(20) DEFAULT 'medium' CHECK (remediation_effort IN ('low', 'medium', 'high')),
    references TEXT[],
    tags TEXT[],
    notes TEXT,
    assigned_to INTEGER REFERENCES users(id),
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    updated_by INTEGER REFERENCES users(id)
);

-- Índices
CREATE INDEX idx_vulnerabilities_scan_id ON vulnerabilities(scan_id);
CREATE INDEX idx_vulnerabilities_target_id ON vulnerabilities(target_id);
CREATE INDEX idx_vulnerabilities_severity ON vulnerabilities(severity);
CREATE INDEX idx_vulnerabilities_status ON vulnerabilities(status);
CREATE INDEX idx_vulnerabilities_cvss_score ON vulnerabilities(cvss_score);
CREATE INDEX idx_vulnerabilities_tool_detected ON vulnerabilities(tool_detected);
CREATE INDEX idx_vulnerabilities_cwe_id ON vulnerabilities(cwe_id);
CREATE INDEX idx_vulnerabilities_cve_id ON vulnerabilities(cve_id);
CREATE INDEX idx_vulnerabilities_assigned_to ON vulnerabilities(assigned_to);
CREATE INDEX idx_vulnerabilities_created_at ON vulnerabilities(created_at);
CREATE INDEX idx_vulnerabilities_tags ON vulnerabilities USING GIN(tags);
CREATE INDEX idx_vulnerabilities_references ON vulnerabilities USING GIN(references);
```

### **5. Tabela de Relatórios (reports)**
```sql
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('executive', 'technical', 'detailed', 'compliance', 'custom')),
    target_id INTEGER REFERENCES targets(id) ON DELETE SET NULL,
    scan_id UUID REFERENCES scans(id) ON DELETE SET NULL,
    format VARCHAR(20) DEFAULT 'pdf' CHECK (format IN ('pdf', 'html', 'json', 'xml', 'csv')),
    status VARCHAR(50) DEFAULT 'generating' CHECK (status IN ('generating', 'completed', 'failed')),
    file_path VARCHAR(500),
    file_size BIGINT,
    file_hash VARCHAR(64),
    download_url VARCHAR(500),
    template_used VARCHAR(100),
    sections JSONB DEFAULT '[]',
    filters JSONB DEFAULT '{}',
    summary JSONB,
    generated_by INTEGER REFERENCES users(id),
    generated_at TIMESTAMP,
    expires_at TIMESTAMP,
    is_public BOOLEAN DEFAULT false,
    access_token VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_reports_type ON reports(type);
CREATE INDEX idx_reports_target_id ON reports(target_id);
CREATE INDEX idx_reports_scan_id ON reports(scan_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_generated_by ON reports(generated_by);
CREATE INDEX idx_reports_generated_at ON reports(generated_at);
CREATE INDEX idx_reports_expires_at ON reports(expires_at);
```

### **6. Tabela de Integrações (integrations)**
```sql
CREATE TABLE integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('notification', 'version_control', 'ci_cd', 'ticketing', 'monitoring', 'custom')),
    provider VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'error', 'testing')),
    config JSONB NOT NULL,
    webhook_url VARCHAR(500),
    webhook_secret VARCHAR(255),
    api_key VARCHAR(500),
    api_secret VARCHAR(500),
    access_token VARCHAR(500),
    refresh_token VARCHAR(500),
    token_expires_at TIMESTAMP,
    last_sync TIMESTAMP,
    last_error TEXT,
    error_count INTEGER DEFAULT 0,
    retry_after TIMESTAMP,
    enabled_features TEXT[],
    metadata JSONB DEFAULT '{}',
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_integrations_type ON integrations(type);
CREATE INDEX idx_integrations_provider ON integrations(provider);
CREATE INDEX idx_integrations_status ON integrations(status);
CREATE INDEX idx_integrations_created_by ON integrations(created_by);
CREATE INDEX idx_integrations_enabled_features ON integrations USING GIN(enabled_features);
```

### **7. Tabela de Logs de Auditoria (audit_logs)**
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(255),
    resource_name VARCHAR(255),
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(255),
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource_type ON audit_logs(resource_type);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_success ON audit_logs(success);
CREATE INDEX idx_audit_logs_ip_address ON audit_logs(ip_address);
```

### **8. Tabela de Configurações (settings)**
```sql
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    category VARCHAR(100) DEFAULT 'general',
    is_system BOOLEAN DEFAULT false,
    is_encrypted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER REFERENCES users(id)
);

-- Índices
CREATE INDEX idx_settings_key ON settings(key);
CREATE INDEX idx_settings_category ON settings(category);
CREATE INDEX idx_settings_is_system ON settings(is_system);
```

## 🔄 Relacionamentos e Constraints

### **1. Foreign Key Constraints**
```sql
-- Adicionar constraints de foreign key
ALTER TABLE targets ADD CONSTRAINT fk_targets_owner 
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE scans ADD CONSTRAINT fk_scans_target 
    FOREIGN KEY (target_id) REFERENCES targets(id) ON DELETE CASCADE;

ALTER TABLE vulnerabilities ADD CONSTRAINT fk_vulnerabilities_scan 
    FOREIGN KEY (scan_id) REFERENCES scans(id) ON DELETE CASCADE;

ALTER TABLE vulnerabilities ADD CONSTRAINT fk_vulnerabilities_target 
    FOREIGN KEY (target_id) REFERENCES targets(id) ON DELETE CASCADE;
```

### **2. Check Constraints**
```sql
-- Constraints de validação
ALTER TABLE targets ADD CONSTRAINT chk_targets_risk_score 
    CHECK (risk_score >= 0 AND risk_score <= 100);

ALTER TABLE vulnerabilities ADD CONSTRAINT chk_vulnerabilities_cvss_score 
    CHECK (cvss_score >= 0.0 AND cvss_score <= 10.0);

ALTER TABLE scans ADD CONSTRAINT chk_scans_progress 
    CHECK (progress >= 0 AND progress <= 100);
```

### **3. Unique Constraints**
```sql
-- Constraints de unicidade
ALTER TABLE users ADD CONSTRAINT uk_users_username UNIQUE (username);
ALTER TABLE users ADD CONSTRAINT uk_users_email UNIQUE (email);
ALTER TABLE targets ADD CONSTRAINT uk_targets_name UNIQUE (name);
```

## 📊 Views e Funções

### **1. View de Resumo de Targets**
```sql
CREATE VIEW target_summary AS
SELECT 
    t.id,
    t.name,
    t.type,
    t.category,
    t.status,
    t.risk_score,
    t.last_scan,
    t.next_scan,
    COUNT(v.id) as total_vulnerabilities,
    COUNT(CASE WHEN v.severity = 'critical' THEN 1 END) as critical_vulns,
    COUNT(CASE WHEN v.severity = 'high' THEN 1 END) as high_vulns,
    COUNT(CASE WHEN v.severity = 'medium' THEN 1 END) as medium_vulns,
    COUNT(CASE WHEN v.severity = 'low' THEN 1 END) as low_vulns,
    COUNT(CASE WHEN v.status = 'open' THEN 1 END) as open_vulns
FROM targets t
LEFT JOIN vulnerabilities v ON t.id = v.target_id
GROUP BY t.id, t.name, t.type, t.category, t.status, t.risk_score, t.last_scan, t.next_scan;
```

### **2. View de Métricas de Scan**
```sql
CREATE VIEW scan_metrics AS
SELECT 
    s.id,
    s.name,
    s.scan_type,
    s.status,
    s.progress,
    s.started_at,
    s.completed_at,
    s.duration,
    t.name as target_name,
    t.type as target_type,
    COUNT(v.id) as vulnerabilities_found,
    COUNT(CASE WHEN v.severity = 'critical' THEN 1 END) as critical_found,
    COUNT(CASE WHEN v.severity = 'high' THEN 1 END) as high_found,
    u.username as created_by_user
FROM scans s
LEFT JOIN targets t ON s.target_id = t.id
LEFT JOIN vulnerabilities v ON s.id = v.scan_id
LEFT JOIN users u ON s.created_by = u.id
GROUP BY s.id, s.name, s.scan_type, s.status, s.progress, s.started_at, s.completed_at, s.duration, t.name, t.type, u.username;
```

### **3. Função de Atualização de Risk Score**
```sql
CREATE OR REPLACE FUNCTION update_target_risk_score(target_id INTEGER)
RETURNS INTEGER AS $$
DECLARE
    new_risk_score INTEGER;
BEGIN
    SELECT 
        CASE 
            WHEN critical_count > 0 THEN 90 + (critical_count * 2)
            WHEN high_count > 0 THEN 70 + (high_count * 3)
            WHEN medium_count > 0 THEN 50 + (medium_count * 2)
            WHEN low_count > 0 THEN 30 + (low_count * 1)
            ELSE 0
        END
    INTO new_risk_score
    FROM (
        SELECT 
            COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical_count,
            COUNT(CASE WHEN severity = 'high' THEN 1 END) as high_count,
            COUNT(CASE WHEN severity = 'medium' THEN 1 END) as medium_count,
            COUNT(CASE WHEN severity = 'low' THEN 1 END) as low_count
        FROM vulnerabilities 
        WHERE target_id = $1 AND status IN ('new', 'open')
    ) vuln_counts;
    
    UPDATE targets 
    SET risk_score = LEAST(new_risk_score, 100), updated_at = CURRENT_TIMESTAMP
    WHERE id = target_id;
    
    RETURN new_risk_score;
END;
$$ LANGUAGE plpgsql;
```

## 🔐 Segurança e Criptografia

### **1. Criptografia de Dados Sensíveis**
```sql
-- Função para criptografar dados sensíveis
CREATE OR REPLACE FUNCTION encrypt_sensitive_data(data TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN pgp_sym_encrypt(data, current_setting('app.encryption_key'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para descriptografar dados sensíveis
CREATE OR REPLACE FUNCTION decrypt_sensitive_data(encrypted_data TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN pgp_sym_decrypt(encrypted_data::bytea, current_setting('app.encryption_key'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### **2. Row Level Security (RLS)**
```sql
-- Habilitar RLS nas tabelas
ALTER TABLE targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE vulnerabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY target_access_policy ON targets
    FOR ALL
    USING (
        created_by = current_setting('app.current_user_id')::INTEGER
        OR EXISTS (
            SELECT 1 FROM users 
            WHERE id = current_setting('app.current_user_id')::INTEGER 
            AND role = 'admin'
        )
    );
```

## 📈 Performance e Otimização

### **1. Índices Parciais**
```sql
-- Índice para vulnerabilidades ativas
CREATE INDEX idx_vulnerabilities_active ON vulnerabilities(severity, status)
WHERE status IN ('new', 'open');

-- Índice para scans recentes
CREATE INDEX idx_scans_recent ON scans(created_at, status)
WHERE created_at > CURRENT_DATE - INTERVAL '30 days';

-- Índice para targets ativos
CREATE INDEX idx_targets_active ON targets(status, risk_score)
WHERE status = 'active';
```

### **2. Particionamento**
```sql
-- Particionamento por data para audit_logs
CREATE TABLE audit_logs_2025_08 PARTITION OF audit_logs
FOR VALUES FROM ('2025-08-01') TO ('2025-09-01');

CREATE TABLE audit_logs_2025_09 PARTITION OF audit_logs
FOR VALUES FROM ('2025-09-01') TO ('2025-10-01');
```

### **3. Materialized Views**
```sql
-- Materialized view para dashboard
CREATE MATERIALIZED VIEW dashboard_metrics AS
SELECT 
    COUNT(DISTINCT t.id) as total_targets,
    COUNT(DISTINCT s.id) as total_scans,
    COUNT(DISTINCT v.id) as total_vulnerabilities,
    COUNT(CASE WHEN v.severity = 'critical' THEN 1 END) as critical_vulns,
    AVG(t.risk_score) as avg_risk_score
FROM targets t
LEFT JOIN scans s ON t.id = s.target_id
LEFT JOIN vulnerabilities v ON t.id = v.target_id
WHERE t.status = 'active';

-- Refresh da materialized view
REFRESH MATERIALIZED VIEW dashboard_metrics;
```

## 🔄 Migração e Versionamento

### **1. Sistema de Migração**
```sql
-- Tabela de controle de migrações
CREATE TABLE schema_migrations (
    id SERIAL PRIMARY KEY,
    version VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    checksum VARCHAR(64),
    execution_time INTERVAL
);

-- Exemplo de migração
INSERT INTO schema_migrations (version, name) VALUES 
('001', 'Create initial tables'),
('002', 'Add vulnerability tracking'),
('003', 'Add audit logging');
```

### **2. Backup e Recovery**
```sql
-- Função para backup automático
CREATE OR REPLACE FUNCTION create_backup()
RETURNS TEXT AS $$
DECLARE
    backup_file TEXT;
BEGIN
    backup_file := '/backups/purpleteam_' || to_char(CURRENT_TIMESTAMP, 'YYYYMMDD_HH24MISS') || '.sql';
    
    PERFORM pg_dump(
        'purpleteam',
        '--file=' || backup_file,
        '--format=custom',
        '--compress=9'
    );
    
    RETURN backup_file;
END;
$$ LANGUAGE plpgsql;
```

## 📊 Monitoramento e Métricas

### **1. Tabela de Métricas do Sistema**
```sql
CREATE TABLE system_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name VARCHAR(100) NOT NULL,
    metric_value NUMERIC,
    metric_unit VARCHAR(20),
    tags JSONB DEFAULT '{}',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX idx_system_metrics_name ON system_metrics(metric_name);
CREATE INDEX idx_system_metrics_timestamp ON system_metrics(timestamp);
CREATE INDEX idx_system_metrics_tags ON system_metrics USING GIN(tags);
```

### **2. Função de Coleta de Métricas**
```sql
CREATE OR REPLACE FUNCTION collect_database_metrics()
RETURNS VOID AS $$
BEGIN
    -- Métricas de tabelas
    INSERT INTO system_metrics (metric_name, metric_value, metric_unit, tags)
    SELECT 
        'table_size',
        pg_total_relation_size(c.oid),
        'bytes',
        jsonb_build_object('table', c.relname)
    FROM pg_class c
    WHERE c.relkind = 'r' AND c.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
    
    -- Métricas de conexões
    INSERT INTO system_metrics (metric_name, metric_value, metric_unit, tags)
    SELECT 
        'active_connections',
        count(*),
        'connections',
        '{}'::jsonb
    FROM pg_stat_activity
    WHERE state = 'active';
END;
$$ LANGUAGE plpgsql;
```

---

**Última atualização**: 21 de Agosto de 2025  
**Versão**: 4.0.0-master  
**Status**: ✅ Modelo de Dados Completo 