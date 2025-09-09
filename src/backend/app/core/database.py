"""
Securet Flow SSC - Database Configuration
Database connection and session management
"""

from typing import Generator
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.orm import declarative_base
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)

# Create sync engine
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_pre_ping=True,
    pool_recycle=300,
)

# Create sync session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# Base class for models
Base = declarative_base()

async def init_db():
    """Initialize database (sync under the hood)"""
    try:
        # Importar modelos para registrar no metadata
        from app.models import user as _user  # noqa: F401
        from app.models import target as _target  # noqa: F401
        from app.models import scan as _scan  # noqa: F401
        from app.models import report as _report  # noqa: F401
        from app.models import role as _role  # noqa: F401

        # Create all tables
        Base.metadata.create_all(bind=engine)
        logger.info("Database initialized successfully")

        # Seed básico de roles
        try:
            from app.models.role import Role
            with SessionLocal() as db:
                existing = {r.name for r in db.query(Role).all()}
                wanted = [
                    ("admin", "Administrador do sistema"),
                    ("analyst", "Analista de segurança"),
                    ("viewer", "Visualizador"),
                ]
                created = 0
                for name, description in wanted:
                    if name not in existing:
                        db.add(Role(name=name, description=description))
                        created += 1
                if created:
                    db.commit()
                    logger.info(f"Seeded roles: {created} novos")
        except Exception as se:
            logger.warning(f"Role seed skipped/failed: {se}")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        raise

async def close_db():
    """Close database connections (sync engine disposal)"""
    try:
        engine.dispose()
        logger.info("Database connections closed")
    except Exception as e:
        logger.error(f"Database closure failed: {e}")

# Sync version for current endpoints
def get_db() -> Generator[Session, None, None]:
    """Get database session (sync version)"""
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        db.rollback()
        logger.error(f"Database session error: {e}")
        raise
    finally:
        db.close()

# Health check function
async def check_db_health() -> bool:
    """Check database health (sync)"""
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        return False 