# 🚀 Securet Flow SSC - Guia de Início Rápido

## ⚡ Instalação em 5 Minutos

Este guia permite que você tenha o **Securet Flow SSC** funcionando em menos de 5 minutos.

## 📋 Pré-requisitos

### **Sistema Operacional**
- ✅ **Linux** (Ubuntu 20.04+, CentOS 8+, RHEL 8+)
- ✅ **macOS** (10.15+)
- ✅ **Windows** (10/11 com WSL2)

### **Requisitos Mínimos**
- **RAM**: 8GB (recomendado: 16GB+)
- **CPU**: 4 cores (recomendado: 8+ cores)
- **Disco**: 50GB livre (recomendado: 100GB+)
- **Rede**: Conexão estável com internet

### **Software Necessário**
- **Docker** 20.10+
- **Docker Compose** 2.0+
- **Git** (para clonar o repositório)

## 🚀 Instalação Rápida

### **1. Clone o Repositório**
```bash
git clone https://github.com/securet-flow/ssc.git
cd ssc
```

### **2. Execute o Script de Instalação**
```bash
# Linux/macOS
chmod +x install.sh
./install.sh

# Windows (PowerShell)
.\install.ps1
```

### **3. Aguarde a Instalação**
O script irá:
- ✅ Verificar dependências
- ✅ Baixar imagens Docker
- ✅ Configurar serviços
- ✅ Inicializar banco de dados
- ✅ Configurar monitoramento

### **4. Acesse a Plataforma**
```bash
# Dashboard Principal
open http://localhost:3000

# API Documentation
open http://localhost:8000/docs

# Grafana Monitoring
open http://localhost:3001
```

## 🔐 Credenciais Padrão

### **Dashboard Principal**
- **Email**: `admin@securet-flow.com`
- **Senha**: `admin123`

### **Grafana**
- **Usuário**: `admin`
- **Senha**: `securet123`

### **MinIO Console**
- **Usuário**: `minioadmin`
- **Senha**: `minioadmin123`

## 🎯 Primeiros Passos

### **1. Criar Primeiro Target**
```bash
# Via API
curl -X POST "http://localhost:8000/api/v1/targets" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "example.com",
    "type": "web",
    "url": "https://example.com",
    "category": "development"
  }'
```

### **2. Executar Primeiro Scan**
```bash
# Via API
curl -X POST "http://localhost:8000/api/v1/scans" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "target_id": "TARGET_ID",
    "scan_type": "vulnerability",
    "tools": ["nuclei", "zap"]
  }'
```

### **3. Verificar Resultados**
```bash
# Listar vulnerabilidades
curl -X GET "http://localhost:8000/api/v1/vulnerabilities" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📊 Verificação do Sistema

### **Status dos Serviços**
```bash
# Verificar containers
docker-compose ps

# Ver logs
docker-compose logs -f

# Health check
curl http://localhost:8000/health
```

### **Métricas do Sistema**
```bash
# Acessar Grafana
open http://localhost:3001

# Verificar Prometheus
open http://localhost:9090
```

## 🛠️ Configuração Avançada

### **Variáveis de Ambiente**
```bash
# Editar configurações
cp .env.example .env
nano .env

# Principais variáveis
API_HOST=0.0.0.0
API_PORT=8000
DATABASE_URL=postgresql://postgres:password@localhost:5432/securet_flow
REDIS_URL=redis://localhost:6379
```

### **Configuração de Ferramentas**
```bash
# Adicionar API keys
echo "OPENAI_API_KEY=your_key_here" >> .env
echo "SHODAN_API_KEY=your_key_here" >> .env
echo "VIRUSTOTAL_API_KEY=your_key_here" >> .env
```

### **Configuração de Integrações**
```bash
# Discord Bot
echo "DISCORD_TOKEN=your_token_here" >> .env

# Slack Integration
echo "SLACK_BOT_TOKEN=your_token_here" >> .env
```

## 🔧 Comandos Úteis

### **Gerenciamento de Serviços**
```bash
# Iniciar todos os serviços
docker-compose up -d

# Parar todos os serviços
docker-compose down

# Reiniciar serviços
docker-compose restart

# Ver logs de um serviço específico
docker-compose logs -f backend
```

### **Backup e Restore**
```bash
# Criar backup
./scripts/backup.sh

# Restaurar backup
./scripts/restore.sh backup_file.tar.gz
```

### **Atualização**
```bash
# Atualizar para última versão
git pull origin main
docker-compose pull
docker-compose up -d
```

## 🐛 Resolução de Problemas

### **Problemas Comuns**

#### **1. Porta já em uso**
```bash
# Verificar portas em uso
netstat -tulpn | grep :8000

# Parar processo conflitante
sudo lsof -ti:8000 | xargs kill -9
```

#### **2. Docker não inicia**
```bash
# Verificar Docker
docker --version
docker-compose --version

# Reiniciar Docker
sudo systemctl restart docker
```

#### **3. Banco de dados não conecta**
```bash
# Verificar PostgreSQL
docker-compose logs postgres

# Resetar banco
docker-compose down -v
docker-compose up -d postgres
```

#### **4. Memória insuficiente**
```bash
# Verificar uso de memória
free -h

# Ajustar limites Docker
# Editar /etc/docker/daemon.json
{
  "default-shm-size": "2G"
}
```

### **Logs de Debug**
```bash
# Logs detalhados
docker-compose logs -f --tail=100

# Logs de erro
docker-compose logs | grep -i error

# Logs de um serviço específico
docker-compose logs -f backend | grep -i error
```

## 📚 Próximos Passos

### **1. Explorar Funcionalidades**
- [ ] Configurar targets de teste
- [ ] Executar scans básicos
- [ ] Explorar dashboard
- [ ] Configurar alertas

### **2. Configuração Avançada**
- [ ] Configurar integrações
- [ ] Personalizar relatórios
- [ ] Configurar monitoramento
- [ ] Implementar backup

### **3. Desenvolvimento**
- [ ] Explorar APIs
- [ ] Criar ferramentas customizadas
- [ ] Contribuir com o projeto
- [ ] Participar da comunidade

## 🔗 Recursos Adicionais

### **Documentação Completa**
- [📖 Arquitetura](ARCHITECTURE.md)
- [🔧 API Documentation](api/README.md)
- [🎨 Frontend Guide](frontend/README.md)
- [🚀 Deployment Guide](deployment/README.md)

### **Comunidade**
- [💬 Discord](https://discord.gg/securet-flow)
- [🐛 Issues](https://github.com/securet-flow/ssc/issues)
- [💡 Discussions](https://github.com/securet-flow/ssc/discussions)
- [📧 Email](support@securet-flow.com)

### **Tutoriais**
- [🎥 Video Tutorials](https://youtube.com/@securet-flow)
- [📝 Blog](https://blog.securet-flow.com)
- [📚 Wiki](https://github.com/securet-flow/ssc/wiki)

## ✅ Checklist de Verificação

### **Instalação**
- [ ] Docker instalado e funcionando
- [ ] Repositório clonado
- [ ] Script de instalação executado
- [ ] Todos os containers rodando
- [ ] Dashboard acessível
- [ ] API funcionando
- [ ] Grafana acessível

### **Configuração**
- [ ] Credenciais alteradas
- [ ] API keys configuradas
- [ ] Integrações configuradas
- [ ] Backup configurado
- [ ] Monitoramento ativo

### **Teste**
- [ ] Target criado
- [ ] Scan executado
- [ ] Resultados visualizados
- [ ] Relatório gerado
- [ ] Alertas configurados

---

**🎉 Parabéns! Você tem o Securet Flow SSC funcionando!**

> **Status**: ✅ **Sistema Funcionando**
> 
> - Plataforma operacional
> - APIs respondendo
> - Monitoramento ativo
> - Pronto para uso em produção 