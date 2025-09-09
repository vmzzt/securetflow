"""
Securet Flow SSC - Main Application
FastAPI application entry point
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from contextlib import asynccontextmanager
import logging

from app.core.config import settings
from app.core.database import init_db, close_db
from app.api.v1.api import api_router
from app.core.logging import setup_logging
from app.core.middleware import RateLimitMiddleware, LoggingMiddleware, ErrorHandlingMiddleware
import redis.asyncio as redis

# Prometheus metrics
from prometheus_fastapi_instrumentator import Instrumentator

# Configure logging
setup_logging()
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("Starting Securet Flow SSC application...")
    await init_db()
    logger.info("Application started successfully")
    
    # Start metrics
    try:
        Instrumentator().instrument(app).expose(app, include_in_schema=False)
        logger.info("Prometheus metrics exposed at /metrics")
    except Exception as e:
        logger.warning(f"Prometheus instrumentation failed: {e}")

    yield
    
    # Shutdown
    logger.info("Shutting down Securet Flow SSC application...")
    await close_db()
    logger.info("Application shutdown complete")

# Create FastAPI application
app = FastAPI(
    title="Securet Flow SSC",
    description="Security Scanning and Compliance Platform",
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    lifespan=lifespan
)

# Security middleware
if not settings.DEBUG:
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=settings.ALLOWED_HOSTS
    )

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging & Error handling
app.add_middleware(LoggingMiddleware)
app.add_middleware(ErrorHandlingMiddleware)

# Rate limiting (Redis)
try:
    redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
    app.add_middleware(RateLimitMiddleware, redis_client=redis_client)
    logger.info("Rate limiting middleware enabled")
except Exception as e:
    logger.error(f"Failed to initialize Redis for rate limiting: {e}")

# Include API router
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Securet Flow SSC API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": "2024-01-01T00:00:00Z"
    }

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    """Add security headers to all responses"""
    response = await call_next(request)
    
    # Security headers
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = (
        "geolocation=(), microphone=(), camera=(), fullscreen=(self)"
    )

    # Content Security Policy (CSP)
    csp = (
        "default-src 'self'; "
        "base-uri 'self'; frame-ancestors 'none'; object-src 'none'; "
        "script-src 'self'; style-src 'self' 'unsafe-inline'; "
        "img-src 'self' data:; font-src 'self' data:; "
        "connect-src 'self' http: https: ws: wss:; "
        "form-action 'self'"
    )
    response.headers["Content-Security-Policy"] = csp
    
    return response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    ) 