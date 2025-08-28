import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
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

  const getStatusText = () => {
    if (!status) return 'Carregando...';
    if (!status.enabled) return 'Desabilitada';
    if (!status.available) return 'Indisponível';
    return 'Online';
  };

  const getStatusColor = () => {
    if (!status) return 'text-gray-500';
    if (!status.enabled) return 'text-gray-500';
    if (!status.available) return 'text-red-500';
    return 'text-green-500';
  };

  return (
    <div className="space-y-6">
      {/* Status e Controle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>🤖 Godofreda AI</span>
            <span className={`font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {status && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Host:</span> {status.host}:{status.port}
              </div>
              <div>
                <span className="font-medium">Modelo LLM:</span> {status.llm_model}
              </div>
              <div>
                <span className="font-medium">TTS:</span> 
                <span className={`ml-2 ${status.tts_enabled ? 'text-green-500' : 'text-gray-500'}`}>
                  {status.tts_enabled ? 'Ativado' : 'Desativado'}
                </span>
              </div>
              <div>
                <span className="font-medium">Status:</span> 
                <span className={`ml-2 ${status.available ? 'text-green-500' : 'text-red-500'}`}>
                  {status.available ? 'Disponível' : 'Indisponível'}
                </span>
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={status?.enabled || false}
              onChange={(e) => toggleGodofreda(e.target.checked)}
              disabled={loading}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium">
              {status?.enabled ? 'Ativada' : 'Desativada'}
            </span>
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={loadStatus} disabled={loading} variant="outline" size="sm">
              {loading ? 'Carregando...' : 'Atualizar Status'}
            </Button>
            <Button onClick={testConnection} disabled={testing} variant="outline" size="sm">
              {testing ? 'Testando...' : 'Testar Conexão'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Chat com Godofreda */}
      {status?.enabled && status?.available && (
        <Card>
          <CardHeader>
            <CardTitle>💬 Chat com Godofreda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea
              placeholder="Digite sua mensagem para a Godofreda..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            <Button 
              onClick={sendMessage} 
              disabled={sending || !message.trim()}
              className="w-full"
            >
              {sending ? 'Enviando...' : 'Enviar Mensagem'}
            </Button>

            {response && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Resposta da Godofreda:</h4>
                <p className="text-sm">{response.response}</p>
                {response.audio_url && (
                  <audio controls className="mt-2 w-full">
                    <source src={response.audio_url} type="audio/mpeg" />
                    Seu navegador não suporta áudio.
                  </audio>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 