"""
Securet Flow SSC - Target Model
Target database model and operations
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, JSON, ForeignKey, ARRAY
from sqlalchemy.sql import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import relationship
from typing import Optional, List
import logging
from datetime import datetime

from app.core.database import Base

logger = logging.getLogger(__name__)

class Target(Base):
    """Target model"""
    __tablename__ = "targets"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    host = Column(String(255), nullable=False)
    port = Column(Integer)
    protocol = Column(String(10), default="http")
    description = Column(Text)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos
    user = relationship("User", back_populates="targets")
    scans = relationship("Scan", back_populates="target")
    
    @classmethod
    async def get_by_id(cls, db: AsyncSession, target_id: int) -> Optional["Target"]:
        """Get target by ID"""
        result = await db.execute(select(cls).where(cls.id == target_id))
        return result.scalar_one_or_none()
    
    @classmethod
    async def get_by_name(cls, db: AsyncSession, name: str) -> Optional["Target"]:
        """Get target by name"""
        result = await db.execute(select(cls).where(cls.name == name))
        return result.scalar_one_or_none()
    
    @classmethod
    async def get_all(cls, db: AsyncSession, skip: int = 0, limit: int = 100, 
                     category: Optional[str] = None, status: Optional[str] = None) -> List["Target"]:
        """Get all targets with filters"""
        query = select(cls)
        
        if category:
            query = query.where(cls.category == category)
        if status:
            query = query.where(cls.status == status)
        
        result = await db.execute(query.offset(skip).limit(limit))
        return result.scalars().all()
    
    @classmethod
    async def get_by_owner(cls, db: AsyncSession, owner_id: int) -> List["Target"]:
        """Get targets by owner"""
        result = await db.execute(select(cls).where(cls.owner_id == owner_id))
        return result.scalars().all()
    
    @classmethod
    async def create(cls, db: AsyncSession, **kwargs) -> "Target":
        """Create new target"""
        target = cls(**kwargs)
        db.add(target)
        await db.commit()
        await db.refresh(target)
        return target
    
    async def update(self, db: AsyncSession, **kwargs) -> "Target":
        """Update target"""
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        
        await db.commit()
        await db.refresh(self)
        return self
    
    async def delete(self, db: AsyncSession) -> bool:
        """Delete target"""
        await db.delete(self)
        await db.commit()
        return True
    
    def to_dict(self) -> dict:
        """Convert target to dictionary"""
        return {
            "id": self.id,
            "name": self.name,
            "type": self.type,
            "url": self.url,
            "network_range": self.network_range,
            "ip_addresses": self.ip_addresses,
            "domain": self.domain,
            "category": self.category,
            "status": self.status,
            "risk_score": self.risk_score,
            "tags": self.tags,
            "description": self.description,
            "owner_id": self.owner_id,
            "business_unit": self.business_unit,
            "compliance": self.compliance,
            "environment": self.environment,
            "criticality": self.criticality,
            "scan_frequency": self.scan_frequency,
            "last_scan": self.last_scan.isoformat() if self.last_scan else None,
            "next_scan": self.next_scan.isoformat() if self.next_scan else None,
            "scan_config": self.scan_config,
            "metadata": self.metadata,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
    
    @property
    def is_active(self) -> bool:
        """Check if target is active"""
        return self.status == "active"
    
    @property
    def is_critical(self) -> bool:
        """Check if target is critical"""
        return self.criticality == "critical"
    
    def update_risk_score(self, db: AsyncSession, new_score: int) -> "Target":
        """Update risk score"""
        self.risk_score = max(0, min(100, new_score))
        return self 