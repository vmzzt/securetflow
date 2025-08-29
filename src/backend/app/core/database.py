"""
Securet Flow SSC - Database Configuration
Database connection and session management
"""

import asyncio
from typing import AsyncGenerator, Generator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.orm import declarative_base
from sqlalchemy.pool import NullPool
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)

# Create async engine
async_engine = create_async_engine(
    settings.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://"),
    echo=settings.DEBUG,
    poolclass=NullPool if settings.DEBUG else None,
    pool_pre_ping=True,
    pool_recycle=300,
)

# Create async session factory
AsyncSessionLocal = async_sessionmaker(
    async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

# Create sync session factory (for compatibility with existing endpoints)
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=async_engine.sync_engine if hasattr(async_engine, 'sync_engine') else None
)

# Base class for models
Base = declarative_base()

async def init_db():
    """Initialize database"""
    try:
        async with async_engine.begin() as conn:
            # Create all tables
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        raise

async def close_db():
    """Close database connections"""
    try:
        await async_engine.dispose()
        logger.info("Database connections closed")
    except Exception as e:
        logger.error(f"Database closure failed: {e}")

# Sync version for current endpoints
def get_db() -> Generator[Session, None, None]:
    """Get database session (sync version)"""
    # For now, we'll use a simple session with the async engine
    # This is a temporary solution until we migrate all endpoints to async
    try:
        # Create a sync session using the async engine's sync interface
        if hasattr(async_engine, 'sync_engine'):
            db = SessionLocal()
        else:
            # Fallback: create a new sync engine for compatibility
            from sqlalchemy import create_engine
            sync_engine = create_engine(
                settings.DATABASE_URL,
                echo=settings.DEBUG,
                pool_pre_ping=True,
                pool_recycle=300,
            )
            db = sessionmaker(autocommit=False, autoflush=False, bind=sync_engine)()
        
        try:
            yield db
        except Exception as e:
            db.rollback()
            logger.error(f"Database session error: {e}")
            raise
        finally:
            db.close()
    except Exception as e:
        logger.error(f"Database session creation failed: {e}")
        raise

# Async version for future use
async def get_async_db() -> AsyncGenerator[AsyncSession, None]:
    """Get database session (async version)"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception as e:
            await session.rollback()
            logger.error(f"Database session error: {e}")
            raise
        finally:
            await session.close()

# Health check function
async def check_db_health() -> bool:
    """Check database health"""
    try:
        async with AsyncSessionLocal() as session:
            await session.execute("SELECT 1")
        return True
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        return False 