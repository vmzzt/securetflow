# 🤖 Godofreda Service

Serviço de integração com o módulo Godofreda AI no Securet Flow SSC.

## 📋 Visão Geral

O `GodofredaService` é responsável por gerenciar a comunicação entre o backend principal do Securet Flow e o módulo Godofreda AI. Ele permite:

- ✅ Ativar/desativar o módulo Godofreda
- ✅ Verificar status de disponibilidade
- ✅ Enviar mensagens para o chat
- ✅ Testar conexão
- ✅ Gerenciar configurações

## 🔧 Configuração

### Variáveis de Ambiente

```env
# Ativar/Desativar Godofreda
GODOFREDA_ENABLED=true
GODOFREDA_HOST=localhost
GODOFREDA_PORT=8001
GODOFREDA_API_KEY=your_godofreda_api_key

# Configurações do LLM
GODOFREDA_LLM_MODEL=llama3.2:3b

# Configurações de TTS
GODOFREDA_TTS_ENABLED=true
```

## 🚀 Uso

### Instanciação

```python
from app.services.godofreda_service import godofreda_service

# Usar a instância global
status = await godofreda_service.get_status()
```

### Métodos Principais

#### 1. Verificar Status
```python
status = await godofreda_service.get_status()
# Retorna: {
#   "enabled": True,
#   "available": True,
#   "host": "localhost",
#   "port": 8001,
#   "llm_model": "llama3.2:3b",
#   "tts_enabled": True,
#   "base_url": "http://localhost:8001",
#   "status": "online"
# }
```

#### 2. Enviar Mensagem
```python
response = await godofreda_service.send_message(
    message="Olá Godofreda!",
    user_id="user123"
)
```

#### 3. Ativar/Desativar
```python
result = await godofreda_service.toggle_module(enabled=True)
# Retorna: {
#   "enabled": True,
#   "success": True,
#   "message": "Godofreda ativada com sucesso",
#   "available": True
# }
```

#### 4. Testar Conexão
```python
test_result = await godofreda_service.test_connection()
# Retorna: {
#   "success": True,
#   "message": "Conexão com Godofreda estabelecida com sucesso",
#   "response_time": 0.123
# }
```

## 🔌 Endpoints da API

### GET `/api/v1/godofreda/status`
Obtém o status atual da Godofreda.

### POST `/api/v1/godofreda/chat`
Envia uma mensagem para a Godofreda.

**Body:**
```json
{
  "message": "Sua mensagem aqui",
  "user_id": "user123"
}
```

### POST `/api/v1/godofreda/toggle`
Ativa ou desativa o módulo Godofreda.

**Body:**
```json
{
  "enabled": true
}
```

### GET `/api/v1/godofreda/health`
Verifica a saúde da Godofreda.

### POST `/api/v1/godofreda/test-connection`
Testa a conexão com a Godofreda.

## 🛡️ Tratamento de Erros

O serviço inclui tratamento robusto de erros:

- **503 Service Unavailable**: Godofreda não está disponível
- **Timeout**: Configurado para 5s (health check) e 30s (chat)
- **Connection Errors**: Tratamento específico para erros de rede
- **JSON Parsing**: Tratamento de respostas malformadas

## 🔄 Gerenciamento de Conexão

O serviço usa um cliente HTTP assíncrono com:

- **Timeout configurável**: 30s para operações normais, 5s para health checks
- **Retry automático**: Implementado no nível da aplicação
- **Context manager**: Para gerenciamento seguro de recursos

```python
async with godofreda_service.get_client() as client:
    # Usar o cliente HTTP
    pass
```

## 📊 Monitoramento

O serviço retorna informações detalhadas para monitoramento:

- Status de disponibilidade
- Tempo de resposta
- Configurações ativas
- Erros detalhados

## 🔐 Segurança

- **Autenticação**: Suporte a API keys via Bearer token
- **Validação**: Verificação de entrada em todos os endpoints
- **Isolamento**: Configuração independente do módulo principal

## 🧪 Testes

Para testar o serviço:

```python
# Teste de status
status = await godofreda_service.get_status()
assert status["enabled"] == True

# Teste de conexão
test = await godofreda_service.test_connection()
assert test["success"] == True

# Teste de mensagem
response = await godofreda_service.send_message("Teste")
assert "response" in response
```

## 🔧 Desenvolvimento

### Adicionando Novos Métodos

1. Adicione o método na classe `GodofredaService`
2. Implemente tratamento de erros adequado
3. Adicione documentação
4. Crie testes unitários
5. Atualize os endpoints da API se necessário

### Logs e Debug

O serviço usa logging padrão do FastAPI. Para debug:

```python
import logging
logging.getLogger("godofreda_service").setLevel(logging.DEBUG)
```

## 📝 Notas

- O serviço é thread-safe e pode ser usado em múltiplas requisições simultâneas
- A configuração é carregada uma vez na inicialização
- O toggle funciona apenas em memória (reiniciar o serviço reseta a configuração)
- Em produção, considere persistir a configuração em banco de dados 