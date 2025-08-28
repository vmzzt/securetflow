FROM python:3.11-slim

WORKDIR /app

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements e instalar dependências Python
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código da aplicação
COPY backend/ .

# Criar diretórios necessários
RUN mkdir -p logs tts_temp tts_models

# Expor porta
EXPOSE 8000

# Comando para executar a aplicação
CMD ["python", "main.py"] 