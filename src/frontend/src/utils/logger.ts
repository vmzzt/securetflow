export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  data?: any;
}

class SecureLogger {
  private level: LogLevel;
  private isProduction: boolean;

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.level = this.isProduction ? LogLevel.ERROR : LogLevel.DEBUG;
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.level;
  }

  private sanitizeData(data: any): any {
    if (!data) return data;
    
    // Remove sensitive information
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth', 'credential'];
    const sanitized = JSON.parse(JSON.stringify(data));
    
    const sanitizeObject = (obj: any): any => {
      if (typeof obj !== 'object' || obj === null) return obj;
      
      if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
      }
      
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        const lowerKey = key.toLowerCase();
        if (sensitiveKeys.some(sensitive => lowerKey.includes(sensitive))) {
          result[key] = '[REDACTED]';
        } else {
          result[key] = sanitizeObject(value);
        }
      }
      return result;
    };
    
    return sanitizeObject(sanitized);
  }

  private formatMessage(level: LogLevel, message: string, context?: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const levelName = LogLevel[level];
    const contextStr = context ? ` [${context}]` : '';
    const dataStr = data ? ` ${JSON.stringify(this.sanitizeData(data))}` : '';
    
    return `${timestamp} ${levelName}${contextStr}: ${message}${dataStr}`;
  }

  error(message: string, context?: string, data?: any): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const formattedMessage = this.formatMessage(LogLevel.ERROR, message, context, data);
      console.error(formattedMessage);
      this.sendToServer(LogLevel.ERROR, message, context, data);
    }
  }

  warn(message: string, context?: string, data?: any): void {
    if (this.shouldLog(LogLevel.WARN)) {
      const formattedMessage = this.formatMessage(LogLevel.WARN, message, context, data);
      console.warn(formattedMessage);
      this.sendToServer(LogLevel.WARN, message, context, data);
    }
  }

  info(message: string, context?: string, data?: any): void {
    if (this.shouldLog(LogLevel.INFO)) {
      const formattedMessage = this.formatMessage(LogLevel.INFO, message, context, data);
      console.info(formattedMessage);
      this.sendToServer(LogLevel.INFO, message, context, data);
    }
  }

  debug(message: string, context?: string, data?: any): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      const formattedMessage = this.formatMessage(LogLevel.DEBUG, message, context, data);
      console.debug(formattedMessage);
      // Don't send debug logs to server in production
      if (!this.isProduction) {
        this.sendToServer(LogLevel.DEBUG, message, context, data);
      }
    }
  }

  private async sendToServer(level: LogLevel, message: string, context?: string, data?: any): Promise<void> {
    try {
      // Only send error and warn logs to server in production
      if (this.isProduction && level > LogLevel.WARN) {
        return;
      }

      const logEntry: LogEntry = {
        level,
        message,
        timestamp: new Date().toISOString(),
        context,
        data: this.sanitizeData(data)
      };

      // Send to logging service (implement as needed)
      await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logEntry)
      });
    } catch (error) {
      // Don't log logging errors to avoid infinite loops
      if (!this.isProduction) {
        console.error('Failed to send log to server:', error);
      }
    }
  }

  // Security-specific logging methods
  securityEvent(event: string, details?: any): void {
    this.warn(`SECURITY EVENT: ${event}`, 'security', details);
  }

  authEvent(event: string, userId?: string, details?: any): void {
    this.info(`AUTH EVENT: ${event}`, 'auth', { userId, ...details });
  }

  apiEvent(method: string, endpoint: string, status: number, details?: any): void {
    this.info(`API ${method} ${endpoint} - ${status}`, 'api', details);
  }

  // Performance logging
  performanceEvent(operation: string, duration: number, details?: any): void {
    this.debug(`PERFORMANCE: ${operation} took ${duration}ms`, 'performance', details);
  }
}

// Global logger instance
export const logger = new SecureLogger();

// Convenience functions
export const logError = (message: string, context?: string, data?: any) => logger.error(message, context, data);
export const logWarn = (message: string, context?: string, data?: any) => logger.warn(message, context, data);
export const logInfo = (message: string, context?: string, data?: any) => logger.info(message, context, data);
export const logDebug = (message: string, context?: string, data?: any) => logger.debug(message, context, data);
export const logSecurity = (event: string, details?: any) => logger.securityEvent(event, details);
export const logAuth = (event: string, userId?: string, details?: any) => logger.authEvent(event, userId, details);
export const logApi = (method: string, endpoint: string, status: number, details?: any) => logger.apiEvent(method, endpoint, status, details);
export const logPerformance = (operation: string, duration: number, details?: any) => logger.performanceEvent(operation, duration, details);

export default logger; 