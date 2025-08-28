"""
Securet Flow SSC - Middleware
Security and utility middlewares
"""

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
import time
import logging
from typing import Dict, Any
import redis.asyncio as redis

from app.core.config import settings

logger = logging.getLogger(__name__)

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Add security headers to all responses"""
    
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # Add security headers
        for header, value in settings.SECURITY_HEADERS.items():
            response.headers[header] = value
        
        return response

class RateLimitMiddleware(BaseHTTPMiddleware):
    """Rate limiting middleware"""
    
    def __init__(self, app, redis_client: redis.Redis = None):
        super().__init__(app)
        self.redis = redis_client
    
    async def dispatch(self, request: Request, call_next):
        if not self.redis:
            return await call_next(request)
        
        # Get client IP
        client_ip = request.client.host
        
        # Check rate limit
        if await self._is_rate_limited(client_ip, request.url.path):
            return JSONResponse(
                status_code=429,
                content={"detail": "Rate limit exceeded"}
            )
        
        response = await call_next(request)
        return response
    
    async def _is_rate_limited(self, client_ip: str, path: str) -> bool:
        """Check if client is rate limited"""
        try:
            # Simple rate limiting
            if path.startswith("/api/v1/scans"):
                limit = 10  # 10 requests per hour for scans
                window = 3600
            else:
                limit = settings.RATE_LIMIT_PER_MINUTE
                window = 60
            
            key = f"rate_limit:{client_ip}:{path}"
            current = await self.redis.get(key)
            
            if current and int(current) >= limit:
                return True
            
            # Increment counter
            pipe = self.redis.pipeline()
            pipe.incr(key)
            pipe.expire(key, window)
            await pipe.execute()
            
            return False
        except Exception as e:
            logger.error(f"Rate limiting error: {e}")
            return False

class LoggingMiddleware(BaseHTTPMiddleware):
    """Request logging middleware"""
    
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # Log request
        logger.info(
            f"Request: {request.method} {request.url.path} - "
            f"Client: {request.client.host}"
        )
        
        response = await call_next(request)
        
        # Calculate duration
        duration = time.time() - start_time
        
        # Log response
        logger.info(
            f"Response: {response.status_code} - "
            f"Duration: {duration:.3f}s"
        )
        
        # Add response time header
        response.headers["X-Response-Time"] = f"{duration:.3f}s"
        
        return response

class ErrorHandlingMiddleware(BaseHTTPMiddleware):
    """Global error handling middleware"""
    
    async def dispatch(self, request: Request, call_next):
        try:
            response = await call_next(request)
            return response
        except Exception as e:
            logger.error(f"Unhandled error: {e}")
            
            return JSONResponse(
                status_code=500,
                content={
                    "detail": "Internal server error",
                    "error_id": f"err_{int(time.time())}"
                }
            ) 