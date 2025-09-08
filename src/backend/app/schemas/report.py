from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class ReportBase(BaseModel):
    title: str
    description: Optional[str] = None
    report_type: str  # vulnerability, compliance, audit, custom
    content: Optional[Dict[str, Any]] = None
    scan_id: Optional[int] = None

class ReportCreate(ReportBase):
    pass

class ReportUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    report_type: Optional[str] = None
    content: Optional[Dict[str, Any]] = None

class ReportResponse(ReportBase):
    id: int
    user_id: Optional[int] = None
    status: str
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime] = None

    class Config:
        from_attributes = True 