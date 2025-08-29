import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface GodofredaStatus {
  enabled: boolean;
  available: boolean;
  host: string;
  port: number;
  llm_model: string;
  tts_enabled: boolean;
}

interface GodofredaResponse {
  response: string;
  audio_url?: string;
  context?: any;
}

export const GodofredaControl: React.FC = () => {
  const [status, setStatus] = useState<GodofredaStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState<GodofredaResponse | null>(null);
  const [sending, setSending] = useState(false);
  const [testing, setTesting] = useState(false);

  // Carregar status inicial
  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/godofreda/status');
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (error) {
      console.error('Erro ao carregar status:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleGodofreda = async (enabled: boolean) => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/godofreda/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled })
      });
      if (response.ok) {
        await loadStatus();
      }
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      setSending(true);
      const response = await fetch('/api/v1/godofreda/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      if (response.ok) {
        const data = await response.json();
        setResponse(data);
        setMessage('');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setSending(false);
    }
  };

  const testConnection = async () => {
    try {
      setTesting(true);
      const response = await fetch('/api/v1/godofreda/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Teste de conexão:', data);
        // Você pode mostrar uma notificação aqui
      }
    } catch (error) {
      console.error('Erro ao testar conexão:', error);
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <Card title="Godofreda Control">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando status...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card title="Status do Godofreda">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              status?.enabled 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {status?.enabled ? 'Ativo' : 'Inativo'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Disponível:</span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              status?.available 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {status?.available ? 'Sim' : 'Não'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Host:</span>
            <span className="text-sm text-gray-600">{status?.host || 'N/A'}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Porta:</span>
            <span className="text-sm text-gray-600">{status?.port || 'N/A'}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Modelo LLM:</span>
            <span className="text-sm text-gray-600">{status?.llm_model || 'N/A'}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">TTS Habilitado:</span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              status?.tts_enabled 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {status?.tts_enabled ? 'Sim' : 'Não'}
            </span>
          </div>
        </div>
        
        <div className="mt-6 flex space-x-3">
          <Button
            onClick={() => toggleGodofreda(!status?.enabled)}
            disabled={loading}
            className="flex-1"
          >
            {status?.enabled ? 'Desativar' : 'Ativar'}
          </Button>
          
          <Button
            onClick={testConnection}
            disabled={testing}
            variant="outline"
            className="flex-1"
          >
            {testing ? 'Testando...' : 'Testar Conexão'}
          </Button>
        </div>
      </Card>

      {/* Chat Card */}
      <Card title="Chat com Godofreda">
        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <Button
              onClick={sendMessage}
              disabled={sending || !message.trim()}
            >
              {sending ? 'Enviando...' : 'Enviar'}
            </Button>
          </div>
          
          {response && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Resposta:</h4>
              <p className="text-gray-700">{response.response}</p>
              {response.audio_url && (
                <div className="mt-3">
                  <audio controls className="w-full">
                    <source src={response.audio_url} type="audio/wav" />
                    Seu navegador não suporta o elemento de áudio.
                  </audio>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}; 