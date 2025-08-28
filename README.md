# 🚀 Securet Flow SSC - Super Sistema de Segurança Cibernética

[![CI/CD](https://github.com/securet-flow/ssc/actions/workflows/ci.yml/badge.svg)](https://github.com/securet-flow/ssc/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![React 18](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.6-green.svg)](https://fastapi.tiangolo.com/)

> **Securet Flow SSC** é um super sistema completo de segurança cibernética que integra análise de vulnerabilidades, IA multimodal, monitoramento em tempo real e automação de segurança em uma plataforma unificada e enterprise-grade.

## 🎯 Visão Geral

O **Securet Flow SSC** é um super projeto que combina:

- 🔍 **Análise de Vulnerabilidades** - Scanner completo com 130+ ferramentas integradas
- 🤖 **IA Multimodal** - Godofreda VTuber com análise inteligente
- 💬 **Chatbot de Segurança** - Assistente IA especializado
- 📊 **Dashboard Unificado** - Interface moderna e responsiva
- 📈 **Monitoramento Simplificado** - Logs e métricas básicas
- 🐳 **Containerização Completa** - Docker e Kubernetes ready
- 🚀 **Arquitetura Escalável** - Microserviços e cloud-native

## 🏗️ Arquitetura Limpa e Focada

```
Securet Flow SSC/
├── 🎨 src/frontend/           # Frontend principal (React + TypeScript)
│   ├── Dashboard/            # Interface unificada
│   ├── Settings/             # Configurações (inclui Godofreda)
│   ├── Security Tools/       # Ferramentas integradas
│   └── Monitoring/           # Métricas e alertas
├── 🔧 src/backend/            # Backend principal (FastAPI)
│   ├── Auth Service/         # Autenticação e autorização
│   ├── Scan Engine/          # Motor de scans
│   ├── Godofreda Service/    # Integração com Godofreda
│   └── Tools Integration/    # Ferramentas de segurança
├── 🤖 src/ai/godofreda/       # Módulo Godofreda (opcional)
│   ├── backend/             # Backend da Godofreda
│   ├── llm/                 # LLM da Godofreda
│   └── config.py           # Configuração do módulo
├── 🛠️ src/tools/             # Ferramentas de segurança
├── 📊 monitoring/            # Stack de monitoramento
└── 🐳 docker/               # Configurações Docker
```

## 🚀 Instalação Rápida

### Pré-requisitos

- **Docker** 20.10+ e **Docker Compose** 2.0+
- **Node.js** 18+ (para desenvolvimento)
- **Python** 3.11+ (para desenvolvimento)
- **Git** (para clonar o repositório)

### 1. Clone o Repositório
```bash
git clone https://github.com/securet-flow/ssc.git
cd ssc
```

### 2. Configure as Variáveis de Ambiente
```bash
cp .env.example .env
# Edite .env com suas configurações
```

### 3. Execute com Docker Compose
```bash
# Build e start de todos os serviços
docker-compose up -d

# Verificar status
docker-compose ps

# Ver logs
docker-compose logs -f
```

### 4. Acesse o Sistema
- **Dashboard Principal**: http://localhost:3000
- **API Backend**: http://localhost:8000
- **Godofreda IA**: http://localhost:3001
- **Ollama**: http://localhost:11434

## 🔐 Credenciais de Acesso

### Dashboard Principal
- **Email**: `admin@securet-flow.com`
- **Senha**: `admin123`

## 🎯 Funcionalidades Principais

### 🔍 **Análise de Vulnerabilidades**
- **130+ Ferramentas** integradas (Nmap, Metasploit, OWASP ZAP, Nuclei, etc.)
- **Scans Automatizados** com agendamento inteligente
- **Análise de Resultados** com IA avançada
- **Relatórios Detalhados** em múltiplos formatos
- **Detecção de Falsos Positivos** com machine learning

### 🤖 **IA Multimodal (Godofreda)**
- **Módulo Opcional** que pode ser ativado/desativado
- **Chat Inteligente** com personalidade sarcástica
- **Síntese de Voz** avançada (TTS)
- **Análise de Imagens** e documentos
- **Contexto Persistente** de conversas
- **Integração Total** com o Securet Flow
- **Controle via Frontend** nas configurações

### 📊 **Dashboard Unificado**
- **Métricas em Tempo Real** de segurança
- **Gráficos Interativos** com Chart.js
- **Alertas Inteligentes** com notificações
- **Interface Responsiva** para todos os dispositivos
- **Tema Escuro/Claro** personalizável

### 🔐 **Segurança Básica**
- **Autenticação simples** com sessões
- **Logs de auditoria** básicos

### 📈 **Monitoramento Simplificado**
- **Logs estruturados** básicos
- **Métricas simples** de performance

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** com TypeScript
- **Tailwind CSS** para estilização
- **Framer Motion** para animações
- **Chart.js** para gráficos
- **Zustand** para gerenciamento de estado
- **React Router** para navegação
- **React Query** para cache de dados

### Backend
- **FastAPI** para APIs de alta performance
- **SQLAlchemy 2.0** com Alembic
- **Redis** para cache e sessões
- **Autenticação simples** com sessões
- **pytest** para testes
- **Pydantic** para validação de dados

### IA e Machine Learning
- **Ollama** para LLMs locais
- **Coqui TTS** para síntese de voz
- **scikit-learn** para ML
- **spaCy** para NLP
- **pgvector** para embeddings

### Infraestrutura
- **PostgreSQL 16** como database principal
- **Redis 7** para cache e sessões
- **Docker** e **Kubernetes**
- **Logs estruturados** básicos

## 📁 Estrutura do Projeto

```
securet-flow-ssc/
├── 📖 docs/                    # Documentação completa
│   ├── api/                   # Especificações da API
│   ├── deployment/            # Guias de deploy
│   ├── development/           # Guias de desenvolvimento
│   ├── config/                # Configurações
│   ├── tools/                 # Arsenal de ferramentas
│   └── roadmaps/              # Roadmaps e planejamento
├── 🎨 src/frontend/            # Frontend React
│   ├── src/
│   │   ├── components/        # Componentes reutilizáveis
│   │   ├── pages/             # Páginas do sistema
│   │   ├── stores/            # Gerenciamento de estado
│   │   ├── services/          # Serviços de API
│   │   ├── hooks/             # Custom hooks
│   │   ├── utils/             # Utilitários
│   │   └── types/             # Tipos TypeScript
│   └── package.json
├── 🔧 src/backend/             # Backend FastAPI
│   ├── app/
│   │   ├── api/               # Endpoints da API
│   │   ├── core/              # Configurações core
│   │   ├── models/            # Modelos de dados
│   │   ├── services/          # Lógica de negócio
│   │   └── utils/             # Utilitários
│   └── requirements.txt
├── 🤖 src/ai/godofreda/        # Módulo Godofreda (opcional)
│   ├── backend/              # Backend da Godofreda
│   ├── llm/                  # LLM da Godofreda
│   └── config.py            # Configuração do módulo
├── 🛠️ src/tools/              # Ferramentas de segurança
├── 🐳 docker/                  # Configurações Docker
│   ├── docker-compose.yml    # Orquestração principal
│   ├── docker-compose.dev.yml # Desenvolvimento
│   └── docker-compose.prod.yml # Produção
├── 📊 monitoring/              # Monitoramento simplificado
│   └── logs/                 # Configurações de logs básicos
└── 🚀 scripts/                 # Scripts de automação
    ├── setup.sh              # Setup inicial
    ├── deploy.sh             # Deploy automatizado
    └── backup.sh             # Backup automático
```

## 🚀 Scripts Disponíveis

### Desenvolvimento
```bash
# Frontend
cd src/frontend
npm install
npm run dev

# Backend
cd src/backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Godofreda (opcional)
cd src/ai/godofreda
docker-compose up -d
```

### Produção
```bash
# Deploy completo
./scripts/deploy.sh

# Backup automático
./scripts/backup.sh
```

### Testes
```bash
# Frontend
cd src/frontend
npm run test
npm run test:coverage

# Backend
cd src/backend
pytest tests/ -v --cov=app

# Godofreda (opcional)
cd src/ai/godofreda
pytest tests/ -v
```

## 🔧 Configuração Avançada

### Variáveis de Ambiente Principais

```env
# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=false
LOG_LEVEL=info

# Database
DATABASE_URL=postgresql://user:pass@localhost/securet_flow
REDIS_URL=redis://localhost:6379
ELASTICSEARCH_URL=http://localhost:9200

# AI Services
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:3b
OPENAI_API_KEY=your_openai_key

# Security
SESSION_SECRET_KEY=your_session_secret

# Logging
LOG_LEVEL=info
```

### Personalização de Tema

Edite `src/frontend/tailwind.config.js` para personalizar cores e estilos:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
        security: {
          low: '#10b981',
          medium: '#f59e0b',
          high: '#ef4444',
          critical: '#7c2d12',
        }
      }
    }
  }
}
```

## 📊 Monitoramento Simplificado

### Logs Disponíveis

- **API Logs**: Requisições e respostas da API
- **Scan Logs**: Logs de execução dos scans
- **AI Logs**: Interações com serviços de IA
- **System Logs**: Logs do sistema e containers

### Visualização de Logs

Use `docker-compose logs` para visualizar logs em tempo real:

```bash
# Todos os logs
docker-compose logs -f

# Logs específicos
docker-compose logs -f backend
docker-compose logs -f godofreda
```

## 🧪 Testes e Qualidade

### Cobertura de Testes

```bash
# Frontend (React)
npm run test:coverage
# Cobertura: >90%

# Backend (FastAPI)
pytest --cov=app --cov-report=html
# Cobertura: >85%

# Godofreda (opcional)
pytest --cov=app --cov-report=html
# Cobertura: >80%
```

### Linting e Formatação

```bash
# Frontend
npm run lint
npm run format

# Backend
black app/
flake8 app/
isort app/
```

## 🚀 Deploy em Produção

### Docker Compose (Recomendado)

```bash
# Deploy completo
docker-compose -f docker/docker-compose.prod.yml up -d

# Verificar status
docker-compose ps

# Logs
docker-compose logs -f
```

### Kubernetes

```bash
# Aplicar manifests
kubectl apply -f k8s/

# Verificar status
kubectl get pods -n securet-flow

# Acessar serviços
kubectl port-forward svc/securet-frontend 3000:80
```

### Cloud Providers

- **AWS**: ECS/EKS com ALB
- **Azure**: AKS com Application Gateway
- **GCP**: GKE com Cloud Load Balancer
- **DigitalOcean**: Kubernetes com Load Balancer

## 🤝 Contribuição

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

### Padrões de Código

- **Frontend**: ESLint + Prettier + TypeScript strict
- **Backend**: Black + Flake8 + isort + mypy
- **IA**: Pytest + coverage + type hints
- **Documentação**: Markdown + OpenAPI/Swagger

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🙏 Agradecimentos

- [FastAPI](https://fastapi.tiangolo.com/) - Framework web moderno
- [React](https://reactjs.org/) - Interface web
- [Ollama](https://ollama.ai/) - LLMs locais
- [Coqui TTS](https://github.com/coqui-ai/TTS) - Síntese de voz
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Docker](https://www.docker.com/) - Containerização

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/securet-flow/ssc/issues)
- **Documentação**: [docs/](docs/)
- **Email**: support@securet-flow.com
- **Discord**: [Servidor da Comunidade](https://discord.gg/securet-flow)

---

**Desenvolvido com ❤️ pela equipe Securet Flow SSC**

> **Status**: ✅ **Arquitetura Limpa e Focada**
> 
> - **Securet Flow** como sistema principal
> - **Godofreda** como módulo opcional integrado
> - Interface unificada e moderna
> - Controle total via frontend
> - Sem código desnecessário
> - Pronto para produção 