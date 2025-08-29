export interface SecurityConfig {
  // HTTPS Configuration
  https: {
    enabled: boolean;
    certPath?: string;
    keyPath?: string;
  };
  
  // Headers Configuration
  headers: {
    'X-Frame-Options': string;
    'X-Content-Type-Options': string;
    'X-XSS-Protection': string;
    'Referrer-Policy': string;
    'Strict-Transport-Security': string;
    'Content-Security-Policy': string;
    'Permissions-Policy': string;
    'X-Permitted-Cross-Domain-Policies': string;
  };
  
  // Rate Limiting Configuration
  rateLimiting: {
    api: {
      maxRequests: number;
      windowMs: number;
    };
    auth: {
      maxRequests: number;
      windowMs: number;
    };
  };
  
  // Authentication Configuration
  auth: {
    tokenExpiry: number; // in seconds
    refreshTokenExpiry: number; // in seconds
    sessionTimeout: number; // in minutes
    maxLoginAttempts: number;
    lockoutDuration: number; // in minutes
  };
  
  // CORS Configuration
  cors: {
    allowedOrigins: string[];
    allowedMethods: string[];
    allowedHeaders: string[];
    credentials: boolean;
  };
  
  // Content Security Policy Configuration
  csp: {
    defaultSrc: string[];
    scriptSrc: string[];
    styleSrc: string[];
    imgSrc: string[];
    fontSrc: string[];
    connectSrc: string[];
    frameSrc: string[];
    objectSrc: string[];
    mediaSrc: string[];
    manifestSrc: string[];
  };
  
  // Logging Configuration
  logging: {
    level: 'error' | 'warn' | 'info' | 'debug';
    enableConsole: boolean;
    enableServer: boolean;
    sanitizeData: boolean;
  };
  
  // File Upload Configuration
  fileUpload: {
    maxSize: number; // in bytes
    allowedTypes: string[];
    scanForViruses: boolean;
    validateContent: boolean;
  };
  
  // Session Configuration
  session: {
    secure: boolean;
    httpOnly: boolean;
    sameSite: 'strict' | 'lax' | 'none';
    maxAge: number; // in seconds
  };
}

// Default security configuration
export const defaultSecurityConfig: SecurityConfig = {
  https: {
    enabled: import.meta.env.PROD,
    certPath: './certs/localhost.pem',
    keyPath: './certs/localhost-key.pem'
  },
  
  headers: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': import.meta.env.PROD 
      ? "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' https:; font-src 'self'; connect-src 'self'; frame-ancestors 'none';"
      : "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' ws: wss:; frame-ancestors 'none';",
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
    'X-Permitted-Cross-Domain-Policies': 'none'
  },
  
  rateLimiting: {
    api: {
      maxRequests: 100,
      windowMs: 60000 // 1 minute
    },
    auth: {
      maxRequests: 5,
      windowMs: 300000 // 5 minutes
    }
  },
  
  auth: {
    tokenExpiry: 3600, // 1 hour
    refreshTokenExpiry: 604800, // 7 days
    sessionTimeout: 30, // 30 minutes
    maxLoginAttempts: 5,
    lockoutDuration: 15 // 15 minutes
  },
  
  cors: {
    allowedOrigins: import.meta.env.PROD 
      ? ['https://securetflow.com', 'https://www.securetflow.com']
      : ['http://localhost:3000', 'https://localhost:3000'],
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true
  },
  
  csp: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:"],
    fontSrc: ["'self'", "data:"],
    connectSrc: ["'self'", "ws:", "wss:"],
    frameSrc: ["'none'"],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
    manifestSrc: ["'self'"]
  },
  
  logging: {
    level: import.meta.env.PROD ? 'error' : 'debug',
    enableConsole: true,
    enableServer: true,
    sanitizeData: true
  },
  
  fileUpload: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      'text/plain',
      'text/csv',
      'application/json',
      'application/xml',
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif'
    ],
    scanForViruses: true,
    validateContent: true
  },
  
  session: {
    secure: import.meta.env.PROD,
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 3600 // 1 hour
  }
};

// Production security configuration (stricter)
export const productionSecurityConfig: SecurityConfig = {
  ...defaultSecurityConfig,
  https: {
    enabled: true
  },
  logging: {
    level: 'error',
    enableConsole: false,
    enableServer: true,
    sanitizeData: true
  },
  csp: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'"],
    imgSrc: ["'self'", "https:"],
    fontSrc: ["'self'"],
    connectSrc: ["'self'"],
    frameSrc: ["'none'"],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
    manifestSrc: ["'self'"]
  }
};

// Development security configuration (more permissive)
export const developmentSecurityConfig: SecurityConfig = {
  ...defaultSecurityConfig,
  https: {
    enabled: false
  },
  logging: {
    level: 'debug',
    enableConsole: true,
    enableServer: false,
    sanitizeData: false
  },
  csp: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:"],
    fontSrc: ["'self'", "data:"],
    connectSrc: ["'self'", "ws:", "wss:", "http://localhost:*"],
    frameSrc: ["'self'"],
    objectSrc: ["'self'"],
    mediaSrc: ["'self'"],
    manifestSrc: ["'self'"]
  }
};

// Get current security configuration based on environment
export const getSecurityConfig = (): SecurityConfig => {
  switch (import.meta.env.MODE) {
    case 'production':
      return productionSecurityConfig;
    case 'development':
      return developmentSecurityConfig;
    default:
      return defaultSecurityConfig;
  }
};

// Validate security configuration
export const validateSecurityConfig = (config: SecurityConfig): string[] => {
  const errors: string[] = [];
  
  // Validate HTTPS configuration
  if (config.https.enabled && (!config.https.certPath || !config.https.keyPath)) {
    errors.push('HTTPS is enabled but certificate paths are not configured');
  }
  
  // Validate rate limiting configuration
  if (config.rateLimiting.auth.maxRequests <= 0) {
    errors.push('Auth rate limiting max requests must be greater than 0');
  }
  
  if (config.rateLimiting.api.maxRequests <= 0) {
    errors.push('API rate limiting max requests must be greater than 0');
  }
  
  // Validate auth configuration
  if (config.auth.tokenExpiry <= 0) {
    errors.push('Token expiry must be greater than 0');
  }
  
  if (config.auth.maxLoginAttempts <= 0) {
    errors.push('Max login attempts must be greater than 0');
  }
  
  // Validate file upload configuration
  if (config.fileUpload.maxSize <= 0) {
    errors.push('File upload max size must be greater than 0');
  }
  
  return errors;
};

// Export current configuration
export const securityConfig = getSecurityConfig();

export default securityConfig; 