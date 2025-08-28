"""
Configuração do módulo Godofreda
Controla a ativação/desativação do módulo
"""

import os
from typing import Optional

class GodofredaConfig:
    """Configuração do módulo Godofreda"""
    
    def __init__(self):
        self.enabled = os.getenv("GODOFREDA_ENABLED", "true").lower() == "true"
        self.host = os.getenv("GODOFREDA_HOST", "localhost")
        self.port = int(os.getenv("GODOFREDA_PORT", "8001"))
        self.api_key = os.getenv("GODOFREDA_API_KEY", "")
        
        # Configurações do LLM
        self.llm_model = os.getenv("GODOFREDA_LLM_MODEL", "llama3.2:3b")
        self.ollama_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        
        # Configurações de TTS
        self.tts_enabled = os.getenv("GODOFREDA_TTS_ENABLED", "true").lower() == "true"
        self.tts_model = os.getenv("GODOFREDA_TTS_MODEL", "tts_models/pt/cv/vits")
        
    @property
    def is_enabled(self) -> bool:
        """Verifica se o módulo está habilitado"""
        return self.enabled
    
    @property
    def base_url(self) -> str:
        """Retorna a URL base da API"""
        return f"http://{self.host}:{self.port}"
    
    def get_headers(self) -> dict:
        """Retorna headers para autenticação"""
        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
        return headers

# Instância global da configuração
godofreda_config = GodofredaConfig() 