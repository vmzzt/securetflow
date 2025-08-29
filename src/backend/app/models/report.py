from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class Report(Base):
    __tablename__ = "reports"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    report_type = Column(String(50), nullable=False)  # vulnerability, compliance, audit, custom
    status = Column(String(20), default="draft")  # draft, published, archived
    content = Column(JSON)  # Report content as JSON
    user_id = Column(Integer, ForeignKey("users.id"))
    scan_id = Column(Integer, ForeignKey("scans.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    published_at = Column(DateTime)
    
    # Relacionamentos
    user = relationship("User", back_populates="reports")
    scan = relationship("Scan", back_populates="reports") 