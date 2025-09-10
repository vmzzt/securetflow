# 🛡️ Securet Flow SSC - Super Sistema de Segurança

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18.2+-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

> **Sistema Enterprise de Segurança Cibernética com IA Integrada**

Securet Flow SSC é uma plataforma completa de segurança cibernética que combina análise de vulnerabilidades, monitoramento em tempo real, automação de scans e inteligência artificial para proteger infraestruturas críticas.

## 🚀 **Execução Rápida (Docker)**

1. Crie e preencha o arquivo `.env` na raiz (exemplo abaixo):

```
# Application
DEBUG=false
HOST=0.0.0.0
PORT=8000
LOG_LEVEL=INFO

# Observability
LOKI_URL=http://loki:3100/loki/api/v1/push

# Celery/Worker
USE_CELERY=true
CELERY_BROKER_URL=redis://redis:6379/0
CELERY_BACKEND_URL=redis://redis:6379/1

# Database
POSTGRES_DB=securet_flow
POSTGRES_USER=securet_user
POSTGRES_PASSWORD=ChangeMe123!
DATABASE_URL=postgresql://securet_user:ChangeMe123!@postgres:5432/securet_flow

# Redis
REDIS_PASSWORD=ChangeRedis123!
REDIS_URL=redis://:ChangeRedis123!@redis:6379

# JWT
JWT_ALGORITHM=HS256
JWT_SECRET_KEY=SuperSecretKey_Change_In_Prod

# CORS
CORS_ORIGINS=["http://localhost:8080","https://localhost:8443"]
```

2. Gere certificados self-signed para desenvolvimento (TLS do Postgres e do Nginx):

```
# Postgres
mkdir -p infra/postgres/certs
openssl req -new -x509 -days 365 -nodes \
  -out infra/postgres/certs/server.crt \
  -keyout infra/postgres/certs/server.key \
  -subj "/CN=postgres"
chmod 600 infra/postgres/certs/server.key

# Frontend (Nginx)
mkdir -p infra/certs
openssl req -new -x509 -days 365 -nodes \
  -out infra/certs/fullchain.pem \
  -keyout infra/certs/privkey.pem \
  -subj "/CN=localhost"
```

3. Suba os serviços principais:

```
docker compose --env-file .env -f infra/docker/docker-compose.yml up -d --build
```

4. (Opcional) Observabilidade (Prometheus/Grafana/Loki):

```
docker compose -f infra/docker/observability-compose.yml up -d
```

5. Endpoints:
- Frontend: https://localhost:8443
- Backend API: http://localhost:8000/api/v1
- Docs: http://localhost:8000/docs (em DEBUG=true)
- Grafana: http://localhost:3001 (admin/admin)

## ✅ **O que está incluído**
- CORS, headers de segurança e CSP no backend
- Rate limiting com Redis
- Logging centralizado (opcional envio ao Loki via `LOKI_URL`)
- Métricas Prometheus em `/metrics`
- Worker Celery opcional para DAST (`USE_CELERY=true`)
- Stubs DAST (ZAP/Nuclei) com fila assíncrona

## 🚀 **Características Principais**

### 🎯 **Funcionalidades Core**
- **🔍 Análise de Vulnerabilidades**: Scans automatizados e manuais
- **📊 Dashboard Interativo**: Métricas em tempo real e visualizações
- **🤖 IA Integrada**: Análise inteligente de ameaças
- **🎯 Gerenciamento de Targets**: Controle completo de alvos
- **📈 Relatórios Avançados**: Documentação detalhada de findings
- **🔒 Autenticação JWT**: Sistema seguro de login
- **📱 Interface Responsiva**: Funciona em desktop e mobile

### 🛠️ **Tecnologias Utilizadas**

#### **Backend**
- **FastAPI** - Framework web moderno e rápido
- **PostgreSQL** - Banco de dados robusto
- **Redis** - Cache de alta performance
- **SQLAlchemy** - ORM para Python
- **JWT** - Autenticação segura
- **Pydantic** - Validação de dados

#### **Frontend**
- **React 18** - Interface moderna
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Design system
- **Zustand** - Gerenciamento de estado
- **Axios** - Cliente HTTP
- **React Router** - Navegação

#### **Infraestrutura**
- **Docker** - Containerização
- **Nginx** - Proxy reverso
- **Docker Compose** - Orquestração

## 📋 **Índice**

- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [API](#-api)
- [Arquitetura](#-arquitetura)
- [Segurança](#-segurança)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

## 🚀 **Instalação**

### **Pré-requisitos**
- Docker e Docker Compose
- Git
- 4GB RAM mínimo
- 10GB espaço em disco

### **Instalação Rápida**

```bash
# Clone o repositório
git clone https://github.com/vmzzt/securetflow.git
cd securetflow

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Inicie o sistema
docker compose -f infra/docker/docker-compose.yml up -d

# Acesse a aplicação
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# Documentação API: http://localhost:8000/docs
```

### **Configuração Manual**

```bash
# Backend
cd src/backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd src/frontend
npm install
npm run dev
```

## ⚙️ **Configuração**

### **Variáveis de Ambiente**

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
POSTGRES_DB=securetflow
POSTGRES_USER=securetflow
POSTGRES_PASSWORD=sua_senha_segura
POSTGRES_HOST=postgres
POSTGRES_PORT=5432

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# JWT
JWT_SECRET_KEY=sua_chave_secreta_muito_segura
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
CORS_ORIGINS=["http://localhost:3000", "http://localhost:80"]

# Debug
DEBUG=true
```

### **Portas Utilizadas**
- **3000** - Frontend (React)
- **8000** - Backend (FastAPI)
- **5432** - PostgreSQL
- **6379** - Redis
- **80** - Nginx (Proxy)

## 🎯 **Uso**

### **Primeiro Acesso**

1. Acesse `http://localhost:3000`
2. Clique em "Registrar" para criar uma conta
3. Faça login com suas credenciais
4. Comece criando seus primeiros targets

### **Funcionalidades Principais**

#### **Dashboard**
- Visualize métricas em tempo real
- Acompanhe scans ativos
- Monitore vulnerabilidades
- Acesse ações rápidas

#### **Targets**
- Adicione novos alvos para scan
- Configure protocolos (HTTP, HTTPS, SSH)
- Gerencie portas e descrições
- Organize por categorias

#### **Scans**
- Execute scans automatizados
- Monitore progresso em tempo real
- Visualize resultados detalhados
- Exporte relatórios

#### **Vulnerabilities**
- Analise findings por severidade
- Acompanhe tendências
- Gere relatórios de compliance
- Integre com ferramentas externas

## 🔌 **API**

### **Endpoints Principais**

#### **Autenticação**
```http
POST /auth/register    # Registrar usuário
POST /auth/login       # Login
GET  /auth/me          # Perfil do usuário
POST /auth/logout      # Logout
```

#### **Dashboard**
```http
GET /dashboard/stats   # Estatísticas do dashboard
```

#### **Targets**
```http
GET    /targets/       # Listar targets
POST   /targets/       # Criar target
GET    /targets/{id}   # Obter target
PUT    /targets/{id}   # Atualizar target
DELETE /targets/{id}   # Deletar target
```

#### **Scans**
```http
GET    /scans/         # Listar scans
POST   /scans/         # Criar scan
GET    /scans/{id}     # Obter scan
PUT    /scans/{id}     # Atualizar scan
DELETE /scans/{id}     # Deletar scan
POST   /scans/{id}/start  # Iniciar scan
POST   /scans/{id}/stop   # Parar scan
```

### **Exemplo de Uso da API**

```bash
# Login
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=senha123"

# Criar target
curl -X POST "http://localhost:8000/targets/" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Exemplo.com",
    "host": "exemplo.com",
    "protocol": "https",
    "port": 443,
    "description": "Site de exemplo"
  }'
```

## 🏗️ **Arquitetura**

### **Estrutura do Projeto**
```
securetflow/
├── src/
│   ├── backend/           # API FastAPI
│   │   ├── app/
│   │   │   ├── api/       # Endpoints
│   │   │   ├── core/      # Configurações
│   │   │   ├── models/    # Modelos SQLAlchemy
│   │   │   └── schemas/   # Schemas Pydantic
│   │   └── requirements.txt
│   └── frontend/          # Aplicação React
│       ├── src/
│       │   ├── components/ # Componentes UI
│       │   ├── pages/      # Páginas
│       │   ├── stores/     # Zustand stores
│       │   └── services/   # Serviços API
│       └── package.json
├── infra/
│   ├── docker/
│   │   └── docker-compose.yml     # Orquestração Docker
│   └── nginx/
│       └── nginx.conf            # Configuração Nginx
└── README.md
```

### **Fluxo de Dados**
```
Frontend (React) ↔ API (FastAPI) ↔ Database (PostgreSQL)
                              ↕
                         Cache (Redis)
```

### **Segurança**
- **JWT Authentication** - Tokens seguros
- **CORS Protection** - Controle de origens
- **Input Validation** - Validação de dados
- **SQL Injection Protection** - ORM seguro
- **XSS Protection** - Headers de segurança

## 🔒 **Segurança**

### **Medidas Implementadas**
- ✅ Autenticação JWT
- ✅ Hash de senhas (bcrypt)
- ✅ Validação de entrada
- ✅ Headers de segurança
- ✅ CORS configurado
- ✅ Rate limiting
- ✅ Logs de auditoria

### **Boas Práticas**
- Sempre use HTTPS em produção
- Mantenha dependências atualizadas
- Monitore logs regularmente
- Faça backups do banco de dados
- Use senhas fortes

## 🧪 **Testes**

### **Executar Testes**
```bash
# Backend
cd src/backend
pytest

# Frontend
cd src/frontend
npm test
```

### **Cobertura de Testes**
- ✅ Testes de autenticação
- ✅ Testes de API
- ✅ Testes de componentes
- ✅ Testes de integração

## 🚀 **Deploy**

### **Produção**
```bash
# Build das imagens
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

### **Monitoramento**
- Logs estruturados
- Métricas de performance
- Health checks
- Alertas automáticos

## 🤝 **Contribuição**

### **Como Contribuir**
1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### **Padrões de Código**
- Use TypeScript no frontend
- Siga PEP 8 no Python
- Documente funções e classes
- Escreva testes para novas funcionalidades

## 📊 **Status do Projeto**

### **Funcionalidades Implementadas**
- ✅ Dashboard interativo
- ✅ Gerenciamento de targets
- ✅ Sistema de scans
- ✅ Autenticação JWT
- ✅ API RESTful
- ✅ Interface responsiva
- ✅ Documentação completa

### **Próximas Funcionalidades**
- 🔄 Integração com ferramentas externas
- 🔄 Relatórios avançados
- 🔄 Automação de workflows
- 🔄 Machine Learning para detecção


### **FAQ**
**Q: Como resetar a senha?**
A: Use o endpoint `/auth/reset-password`

**Q: Como adicionar novos tipos de scan?**
A: Configure no arquivo de configuração do backend

**Q: Como fazer backup do banco?**
A: Use `docker-compose exec postgres pg_dump`

## 📄 **Licença**

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🙏 **Agradecimentos**

- FastAPI pela excelente documentação
- React pela framework incrível
- Tailwind CSS pelo design system
- Comunidade open source

---

**Desenvolvido com ❤️ pela equipe Securet Flow SSC**

[![GitHub stars](https://img.shields.io/github/stars/seu-usuario/securet-flow-ssc?style=social)](https://github.com/seu-usuario/securet-flow-ssc)
[![GitHub forks](https://img.shields.io/github/forks/seu-usuario/securet-flow-ssc?style=social)](https://github.com/seu-usuario/securet-flow-ssc)
[![GitHub issues](https://img.shields.io/github/issues/seu-usuario/securet-flow-ssc)](https://github.com/seu-usuario/securet-flow-ssc/issues) 