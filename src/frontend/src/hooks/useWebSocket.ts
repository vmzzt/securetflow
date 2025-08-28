import { useState, useEffect, useRef, useCallback } from 'react';

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
}

export interface WebSocketConfig {
  url: string;
  protocols?: string | string[];
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
  heartbeatMessage?: string;
}

export interface WebSocketState {
  isConnected: boolean;
  isConnecting: boolean;
  isReconnecting: boolean;
  reconnectAttempts: number;
  lastMessage: WebSocketMessage | null;
  error: string | null;
}

export type MessageHandler = (message: WebSocketMessage) => void;

export function useWebSocket(config: WebSocketConfig) {
  const {
    url,
    protocols,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
    heartbeatInterval = 30000,
    heartbeatMessage = 'ping',
  } = config;

  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    isConnecting: false,
    isReconnecting: false,
    reconnectAttempts: 0,
    lastMessage: null,
    error: null,
  });

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageHandlersRef = useRef<Map<string, MessageHandler[]>>(new Map());
  const shouldReconnectRef = useRef(true);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      wsRef.current = new WebSocket(url, protocols);
      
      wsRef.current.onopen = () => {
        setState(prev => ({
          ...prev,
          isConnected: true,
          isConnecting: false,
          isReconnecting: false,
          reconnectAttempts: 0,
          error: null,
        }));

        // Start heartbeat
        if (heartbeatInterval > 0) {
          heartbeatTimeoutRef.current = setInterval(() => {
            if (wsRef.current?.readyState === WebSocket.OPEN) {
              wsRef.current.send(heartbeatMessage);
            }
          }, heartbeatInterval);
        }
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = {
            type: 'message',
            data: JSON.parse(event.data),
            timestamp: Date.now(),
          };

          setState(prev => ({ ...prev, lastMessage: message }));

          // Call registered handlers
          const handlers = messageHandlersRef.current.get(message.type) || [];
          handlers.forEach(handler => handler(message));
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      wsRef.current.onclose = (event) => {
        setState(prev => ({
          ...prev,
          isConnected: false,
          isConnecting: false,
          error: event.reason || 'Connection closed',
        }));

        // Clear heartbeat
        if (heartbeatTimeoutRef.current) {
          clearInterval(heartbeatTimeoutRef.current);
          heartbeatTimeoutRef.current = null;
        }

        // Attempt reconnect if not manually closed
        if (shouldReconnectRef.current && state.reconnectAttempts < maxReconnectAttempts) {
          setState(prev => ({ ...prev, isReconnecting: true }));
          
          reconnectTimeoutRef.current = setTimeout(() => {
            setState(prev => ({ ...prev, reconnectAttempts: prev.reconnectAttempts + 1 }));
            connect();
          }, reconnectInterval);
        }
      };

      wsRef.current.onerror = (error) => {
        setState(prev => ({
          ...prev,
          error: 'WebSocket error occurred',
          isConnecting: false,
        }));
        // WebSocket error logged
      };
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to create WebSocket connection',
        isConnecting: false,
      }));
    }
  }, [url, protocols, reconnectInterval, maxReconnectAttempts, heartbeatInterval, heartbeatMessage, state.reconnectAttempts]);

  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false;
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (heartbeatTimeoutRef.current) {
      clearInterval(heartbeatTimeoutRef.current);
      heartbeatTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setState(prev => ({
      ...prev,
      isConnected: false,
      isConnecting: false,
      isReconnecting: false,
      reconnectAttempts: 0,
    }));
  }, []);

  const send = useCallback((data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
      return true;
    }
    return false;
  }, []);

  const subscribe = useCallback((messageType: string, handler: MessageHandler) => {
    const handlers = messageHandlersRef.current.get(messageType) || [];
    handlers.push(handler);
    messageHandlersRef.current.set(messageType, handlers);

    // Return unsubscribe function
    return () => {
      const currentHandlers = messageHandlersRef.current.get(messageType) || [];
      const index = currentHandlers.indexOf(handler);
      if (index > -1) {
        currentHandlers.splice(index, 1);
        messageHandlersRef.current.set(messageType, currentHandlers);
      }
    };
  }, []);

  const unsubscribe = useCallback((messageType: string, handler: MessageHandler) => {
    const handlers = messageHandlersRef.current.get(messageType) || [];
    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
      messageHandlersRef.current.set(messageType, handlers);
    }
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    ...state,
    connect,
    disconnect,
    send,
    subscribe,
    unsubscribe,
  };
}

// Convenience hook for specific message types
export function useWebSocketMessage<T = any>(
  ws: ReturnType<typeof useWebSocket>,
  messageType: string
) {
  const [message, setMessage] = useState<WebSocketMessage | null>(null);

  useEffect(() => {
    const unsubscribe = ws.subscribe(messageType, (msg) => {
      setMessage(msg);
    });

    return unsubscribe;
  }, [ws, messageType]);

  return message;
}

// Hook for real-time data updates
export function useWebSocketData<T = any>(
  ws: ReturnType<typeof useWebSocket>,
  messageType: string,
  initialData?: T
) {
  const [data, setData] = useState<T | undefined>(initialData);

  useEffect(() => {
    const unsubscribe = ws.subscribe(messageType, (msg) => {
      setData(msg.data);
    });

    return unsubscribe;
  }, [ws, messageType]);

  return data;
}

export default useWebSocket; 