import { EventEmitter } from 'events';

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
  id?: string;
}

export interface WebSocketOptions {
  url: string;
  protocols?: string | string[];
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
  heartbeatTimeout?: number;
  autoReconnect?: boolean;
  debug?: boolean;
}

export interface WebSocketState {
  connected: boolean;
  connecting: boolean;
  reconnecting: boolean;
  readyState: number;
  url: string;
  reconnectAttempts: number;
  lastMessageTime: number;
}

export interface WebSocketEvents {
  open: () => void;
  close: (event: CloseEvent) => void;
  message: (message: WebSocketMessage) => void;
  error: (error: Event) => void;
  reconnect: (attempt: number) => void;
  heartbeat: () => void;
}

class WebSocketClient extends EventEmitter {
  private ws: WebSocket | null = null;
  private options: Required<WebSocketOptions>;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private heartbeatTimeoutTimer: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;
  private lastMessageTime = 0;
  private messageQueue: WebSocketMessage[] = [];
  private isDestroyed = false;

  constructor(options: WebSocketOptions) {
    super();
    
    this.options = {
      url: options.url,
      protocols: options.protocols || [],
      reconnectInterval: options.reconnectInterval || 5000,
      maxReconnectAttempts: options.maxReconnectAttempts || 10,
      heartbeatInterval: options.heartbeatInterval || 30000,
      heartbeatTimeout: options.heartbeatTimeout || 5000,
      autoReconnect: options.autoReconnect !== false,
      debug: options.debug || false,
    };

    this.log('WebSocket client initialized', { options: this.options });
  }

  // Connect to WebSocket server
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      if (this.ws && this.ws.readyState === WebSocket.CONNECTING) {
        this.ws.addEventListener('open', () => resolve());
        this.ws.addEventListener('error', (error) => reject(error));
        return;
      }

      try {
        this.ws = new WebSocket(this.options.url, this.options.protocols);
        this.setupEventListeners();

        this.ws.addEventListener('open', () => {
          this.log('WebSocket connected');
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          this.flushMessageQueue();
          this.emit('open');
          resolve();
        });

        this.ws.addEventListener('error', (error) => {
          this.log('WebSocket error', error);
          this.emit('error', error);
          reject(error);
        });
      } catch (error) {
        this.log('Failed to create WebSocket', error);
        reject(error);
      }
    });
  }

  // Disconnect from WebSocket server
  disconnect(): void {
    this.log('Disconnecting WebSocket');
    this.stopHeartbeat();
    this.clearReconnectTimer();
    
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
  }

  // Send message
  send(type: string, data: any = null, id?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const message: WebSocketMessage = {
        type,
        data,
        timestamp: Date.now(),
        id,
      };

      if (this.isConnected()) {
        try {
          this.ws!.send(JSON.stringify(message));
          this.log('Message sent', { type, id });
          resolve();
        } catch (error) {
          this.log('Failed to send message', error);
          reject(error);
        }
      } else {
        // Queue message for later
        this.messageQueue.push(message);
        this.log('Message queued', { type, id, queueLength: this.messageQueue.length });
        resolve();
      }
    });
  }

  // Subscribe to a channel
  subscribe(channel: string, callback?: (data: any) => void): void {
    this.send('subscribe', { channel });
    
    if (callback) {
      this.on(`channel:${channel}`, callback);
    }
  }

  // Unsubscribe from a channel
  unsubscribe(channel: string, callback?: (data: any) => void): void {
    this.send('unsubscribe', { channel });
    
    if (callback) {
      this.off(`channel:${channel}`, callback);
    }
  }

  // Get current state
  getState(): WebSocketState {
    return {
      connected: this.isConnected(),
      connecting: this.isConnecting(),
      reconnecting: this.reconnectAttempts > 0,
      readyState: this.ws?.readyState || WebSocket.CLOSED,
      url: this.options.url,
      reconnectAttempts: this.reconnectAttempts,
      lastMessageTime: this.lastMessageTime,
    };
  }

  // Check if connected
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  // Check if connecting
  isConnecting(): boolean {
    return this.ws?.readyState === WebSocket.CONNECTING;
  }

  // Destroy the client
  destroy(): void {
    this.log('Destroying WebSocket client');
    this.isDestroyed = true;
    this.disconnect();
    this.removeAllListeners();
  }

  // Private methods
  private setupEventListeners(): void {
    if (!this.ws) return;

    this.ws.addEventListener('open', () => {
      this.log('WebSocket opened');
      this.emit('open');
    });

    this.ws.addEventListener('close', (event) => {
      this.log('WebSocket closed', { code: event.code, reason: event.reason });
      this.stopHeartbeat();
      this.emit('close', event);

      if (this.options.autoReconnect && !this.isDestroyed) {
        this.scheduleReconnect();
      }
    });

    this.ws.addEventListener('message', (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.lastMessageTime = Date.now();
        
        this.log('Message received', { type: message.type, id: message.id });
        
        // Emit message event
        this.emit('message', message);
        
        // Emit channel-specific events
        if (message.type === 'channel') {
          this.emit(`channel:${message.data.channel}`, message.data);
        }
        
        // Emit type-specific events
        this.emit(`type:${message.type}`, message.data);
        
      } catch (error) {
        this.log('Failed to parse message', error);
      }
    });

    this.ws.addEventListener('error', (error) => {
      this.log('WebSocket error', error);
      this.emit('error', error);
    });
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.options.maxReconnectAttempts) {
      this.log('Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    this.log(`Scheduling reconnect attempt ${this.reconnectAttempts}`);

    this.reconnectTimer = setTimeout(() => {
      this.emit('reconnect', this.reconnectAttempts);
      this.connect().catch((error) => {
        this.log('Reconnect failed', error);
      });
    }, this.options.reconnectInterval);
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private startHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
    }

    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected()) {
        this.send('ping', { timestamp: Date.now() });
        this.emit('heartbeat');
        
        // Set timeout for heartbeat response
        this.heartbeatTimeoutTimer = setTimeout(() => {
          this.log('Heartbeat timeout');
          this.ws?.close(1000, 'Heartbeat timeout');
        }, this.options.heartbeatTimeout);
      }
    }, this.options.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }

    if (this.heartbeatTimeoutTimer) {
      clearTimeout(this.heartbeatTimeoutTimer);
      this.heartbeatTimeoutTimer = null;
    }
  }

  private flushMessageQueue(): void {
    if (this.messageQueue.length === 0) return;

    this.log(`Flushing ${this.messageQueue.length} queued messages`);

    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) {
        this.send(message.type, message.data, message.id).catch((error) => {
          this.log('Failed to send queued message', error);
        });
      }
    }
  }

  private log(message: string, data?: any): void {
    if (this.options.debug) {
      // Debug logging disabled in production
    }
  }
}

// Factory function to create WebSocket client
export function createWebSocketClient(options: WebSocketOptions): WebSocketClient {
  return new WebSocketClient(options);
}

// Default WebSocket client instance
let defaultClient: WebSocketClient | null = null;

export function getDefaultWebSocketClient(): WebSocketClient | null {
  return defaultClient;
}

export function setDefaultWebSocketClient(client: WebSocketClient): void {
  defaultClient = client;
}

export function createDefaultWebSocketClient(options: WebSocketOptions): WebSocketClient {
  defaultClient = new WebSocketClient(options);
  return defaultClient;
}

// Utility functions
export function isWebSocketSupported(): boolean {
  return typeof WebSocket !== 'undefined';
}

export function getWebSocketReadyStateName(readyState: number): string {
  switch (readyState) {
    case WebSocket.CONNECTING:
      return 'CONNECTING';
    case WebSocket.OPEN:
      return 'OPEN';
    case WebSocket.CLOSING:
      return 'CLOSING';
    case WebSocket.CLOSED:
      return 'CLOSED';
    default:
      return 'UNKNOWN';
  }
}

export default WebSocketClient; 