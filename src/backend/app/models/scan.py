from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class Scan(Base):
    __tablename__ = "scans"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    target_id = Column(Integer, ForeignKey("targets.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    status = Column(String(20), default="pending")  # pending, running, completed, failed
    scan_type = Column(String(50), nullable=False)  # vulnerability, port, web, etc.
    created_at = Column(DateTime, default=datetime.utcnow)
    started_at = Column(DateTime)
    completed_at = Column(DateTime)
    
    # Relacionamentos
    user = relationship("User", back_populates="scans")
    target = relationship("Target", back_populates="scans")
    results = relationship("ScanResult", back_populates="scan")
    reports = relationship("Report", back_populates="scan")

class ScanResult(Base):
    __tablename__ = "scan_results"
    
    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(Integer, ForeignKey("scans.id"))
    tool_name = Column(String(50), nullable=False)
    result_data = Column(Text)
    status = Column(String(20), default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    scan = relationship("Scan", back_populates="results") 