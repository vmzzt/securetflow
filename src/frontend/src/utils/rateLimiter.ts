export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyGenerator?: (identifier: string) => string;
}

export interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private static instance: RateLimiter;
  private limits: Map<string, RateLimitEntry> = new Map();
  private config: RateLimitConfig;

  private constructor(config: RateLimitConfig) {
    this.config = config;
    this.cleanup();
  }

  static getInstance(config?: RateLimitConfig): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter(config || {
        maxRequests: 100,
        windowMs: 60000 // 1 minute
      });
    }
    return RateLimiter.instance;
  }

  // Check if request is allowed
  isAllowed(identifier: string): boolean {
    const key = this.config.keyGenerator ? this.config.keyGenerator(identifier) : identifier;
    const now = Date.now();
    
    // Get current entry
    const entry = this.limits.get(key);
    
    if (!entry) {
      // First request
      this.limits.set(key, {
        count: 1,
        resetTime: now + this.config.windowMs
      });
      return true;
    }
    
    // Check if window has expired
    if (now > entry.resetTime) {
      // Reset window
      this.limits.set(key, {
        count: 1,
        resetTime: now + this.config.windowMs
      });
      return true;
    }
    
    // Check if limit exceeded
    if (entry.count >= this.config.maxRequests) {
      return false;
    }
    
    // Increment count
    entry.count++;
    this.limits.set(key, entry);
    return true;
  }

  // Get remaining requests
  getRemaining(identifier: string): number {
    const key = this.config.keyGenerator ? this.config.keyGenerator(identifier) : identifier;
    const entry = this.limits.get(key);
    
    if (!entry) {
      return this.config.maxRequests;
    }
    
    const now = Date.now();
    if (now > entry.resetTime) {
      return this.config.maxRequests;
    }
    
    return Math.max(0, this.config.maxRequests - entry.count);
  }

  // Get reset time
  getResetTime(identifier: string): number {
    const key = this.config.keyGenerator ? this.config.keyGenerator(identifier) : identifier;
    const entry = this.limits.get(key);
    
    if (!entry) {
      return Date.now() + this.config.windowMs;
    }
    
    return entry.resetTime;
  }

  // Reset limit for identifier
  reset(identifier: string): void {
    const key = this.config.keyGenerator ? this.config.keyGenerator(identifier) : identifier;
    this.limits.delete(key);
  }

  // Clear all limits
  clear(): void {
    this.limits.clear();
  }

  // Cleanup expired entries
  private cleanup(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.limits.entries()) {
        if (now > entry.resetTime) {
          this.limits.delete(key);
        }
      }
    }, 60000); // Cleanup every minute
  }
}

// API Rate Limiter
export class ApiRateLimiter {
  private rateLimiter: RateLimiter;
  // private config: RateLimitConfig;

  constructor(config: RateLimitConfig = {
    maxRequests: 100,
    windowMs: 60000
  }) {
    // this.config = config;
    this.rateLimiter = RateLimiter.getInstance(config);
  }

  // Check if API request is allowed
  isAllowed(endpoint: string, userId?: string): boolean {
    const identifier = userId ? `${userId}:${endpoint}` : endpoint;
    return this.rateLimiter.isAllowed(identifier);
  }

  // Get remaining API requests
  getRemaining(endpoint: string, userId?: string): number {
    const identifier = userId ? `${userId}:${endpoint}` : endpoint;
    return this.rateLimiter.getRemaining(identifier);
  }

  // Get reset time for API endpoint
  getResetTime(endpoint: string, userId?: string): number {
    const identifier = userId ? `${userId}:${endpoint}` : endpoint;
    return this.rateLimiter.getResetTime(identifier);
  }

  // Reset limit for API endpoint
  reset(endpoint: string, userId?: string): void {
    const identifier = userId ? `${userId}:${endpoint}` : endpoint;
    this.rateLimiter.reset(identifier);
  }
}

// Auth Rate Limiter (stricter limits for authentication)
export class AuthRateLimiter {
  private rateLimiter: RateLimiter;
  // private config: RateLimitConfig;

  constructor(config: RateLimitConfig = {
    maxRequests: 5, // 5 attempts
    windowMs: 300000 // 5 minutes
  }) {
    // this.config = config;
    this.rateLimiter = RateLimiter.getInstance(config);
  }

  // Check if auth attempt is allowed
  isAllowed(identifier: string): boolean {
    return this.rateLimiter.isAllowed(identifier);
  }

  // Get remaining auth attempts
  getRemaining(identifier: string): number {
    return this.rateLimiter.getRemaining(identifier);
  }

  // Get reset time for auth attempts
  getResetTime(identifier: string): number {
    return this.rateLimiter.getResetTime(identifier);
  }

  // Reset auth limit
  reset(identifier: string): void {
    this.rateLimiter.reset(identifier);
  }

  // Check if account is locked
  isLocked(identifier: string): boolean {
    return !this.isAllowed(identifier);
  }
}

// Global rate limiters
export const apiRateLimiter = new ApiRateLimiter();
export const authRateLimiter = new AuthRateLimiter();

// Convenience functions
export const checkApiRateLimit = (endpoint: string, userId?: string) => apiRateLimiter.isAllowed(endpoint, userId);
export const checkAuthRateLimit = (identifier: string) => authRateLimiter.isAllowed(identifier);
export const getApiRemaining = (endpoint: string, userId?: string) => apiRateLimiter.getRemaining(endpoint, userId);
export const getAuthRemaining = (identifier: string) => authRateLimiter.getRemaining(identifier);
export const isAccountLocked = (identifier: string) => authRateLimiter.isLocked(identifier);

export default RateLimiter; 