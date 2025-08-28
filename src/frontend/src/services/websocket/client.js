import { EventEmitter } from 'events';
class WebSocketClient extends EventEmitter {
    ws = null;
    options;
    reconnectTimer = null;
    heartbeatTimer = null;
    heartbeatTimeoutTimer = null;
    reconnectAttempts = 0;
    lastMessageTime = 0;
    messageQueue = [];
    isDestroyed = false;
    constructor(options) {
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
    connect() {
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
            }
            catch (error) {
                this.log('Failed to create WebSocket', error);
                reject(error);
            }
        });
    }
    // Disconnect from WebSocket server
    disconnect() {
        this.log('Disconnecting WebSocket');
        this.stopHeartbeat();
        this.clearReconnectTimer();
        if (this.ws) {
            this.ws.close(1000, 'Client disconnect');
            this.ws = null;
        }
    }
    // Send message
    send(type, data = null, id) {
        return new Promise((resolve, reject) => {
            const message = {
                type,
                data,
                timestamp: Date.now(),
                id,
            };
            if (this.isConnected()) {
                try {
                    this.ws.send(JSON.stringify(message));
                    this.log('Message sent', { type, id });
                    resolve();
                }
                catch (error) {
                    this.log('Failed to send message', error);
                    reject(error);
                }
            }
            else {
                // Queue message for later
                this.messageQueue.push(message);
                this.log('Message queued', { type, id, queueLength: this.messageQueue.length });
                resolve();
            }
        });
    }
    // Subscribe to a channel
    subscribe(channel, callback) {
        this.send('subscribe', { channel });
        if (callback) {
            this.on(`channel:${channel}`, callback);
        }
    }
    // Unsubscribe from a channel
    unsubscribe(channel, callback) {
        this.send('unsubscribe', { channel });
        if (callback) {
            this.off(`channel:${channel}`, callback);
        }
    }
    // Get current state
    getState() {
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
    isConnected() {
        return this.ws?.readyState === WebSocket.OPEN;
    }
    // Check if connecting
    isConnecting() {
        return this.ws?.readyState === WebSocket.CONNECTING;
    }
    // Destroy the client
    destroy() {
        this.log('Destroying WebSocket client');
        this.isDestroyed = true;
        this.disconnect();
        this.removeAllListeners();
    }
    // Private methods
    setupEventListeners() {
        if (!this.ws)
            return;
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
                const message = JSON.parse(event.data);
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
            }
            catch (error) {
                this.log('Failed to parse message', error);
            }
        });
        this.ws.addEventListener('error', (error) => {
            this.log('WebSocket error', error);
            this.emit('error', error);
        });
    }
    scheduleReconnect() {
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
    clearReconnectTimer() {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
    }
    startHeartbeat() {
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
    stopHeartbeat() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
        if (this.heartbeatTimeoutTimer) {
            clearTimeout(this.heartbeatTimeoutTimer);
            this.heartbeatTimeoutTimer = null;
        }
    }
    flushMessageQueue() {
        if (this.messageQueue.length === 0)
            return;
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
    log(message, data) {
        if (this.options.debug) {
            // Debug logging disabled in production
        }
    }
}
// Factory function to create WebSocket client
export function createWebSocketClient(options) {
    return new WebSocketClient(options);
}
// Default WebSocket client instance
let defaultClient = null;
export function getDefaultWebSocketClient() {
    return defaultClient;
}
export function setDefaultWebSocketClient(client) {
    defaultClient = client;
}
export function createDefaultWebSocketClient(options) {
    defaultClient = new WebSocketClient(options);
    return defaultClient;
}
// Utility functions
export function isWebSocketSupported() {
    return typeof WebSocket !== 'undefined';
}
export function getWebSocketReadyStateName(readyState) {
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
