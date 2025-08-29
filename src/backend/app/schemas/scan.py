"""
Securet Flow SSC - Scan Schemas
Pydantic schemas for scan-related data
"""

from pydantic import BaseModel, field_validator
from typing import Optional, List
from datetime import datetime
from enum import Enum

class ScanStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    PAUSED = "paused"
    CANCELLED = "cancelled"

class ScanType(str, Enum):
    VULNERABILITY = "vulnerability"
    PENETRATION = "penetration"
    COMPLIANCE = "compliance"
    CUSTOM = "custom"

class ScanBase(BaseModel):
    name: str
    description: Optional[str] = None
    target_id: int
    scan_type: ScanType = ScanType.VULNERABILITY
    config: Optional[dict] = None

class ScanCreate(ScanBase):
    pass

class ScanUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    scan_type: Optional[ScanType] = None
    config: Optional[dict] = None

class ScanResponse(ScanBase):
    id: int
    user_id: int
    status: ScanStatus
    created_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    progress: Optional[int] = None
    
    class Config:
        from_attributes = True

class ScanResultBase(BaseModel):
    scan_id: int
    tool_name: str
    result_data: dict
    status: str = "completed"

class ScanResultCreate(ScanResultBase):
    pass

class ScanResultResponse(ScanResultBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True 