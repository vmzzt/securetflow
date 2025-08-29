from pydantic import BaseModel, validator
from typing import Optional, List
from datetime import datetime

class ScanBase(BaseModel):
    name: str
    description: Optional[str] = None
    target_id: int
    scan_type: str

class ScanCreate(ScanBase):
    @validator('name')
    def validate_name(cls, v):
        if len(v.strip()) < 3:
            raise ValueError('Scan name must be at least 3 characters long')
        return v.strip()
    
    @validator('scan_type')
    def validate_scan_type(cls, v):
        allowed_types = ['vulnerability', 'port', 'web', 'network', 'custom']
        if v not in allowed_types:
            raise ValueError(f'Scan type must be one of: {allowed_types}')
        return v

class ScanUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    
    @validator('name')
    def validate_name(cls, v):
        if v is not None and len(v.strip()) < 3:
            raise ValueError('Scan name must be at least 3 characters long')
        return v.strip() if v else v

class ScanResponse(ScanBase):
    id: int
    user_id: int
    status: str
    created_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class ScanResultBase(BaseModel):
    tool_name: str
    result_data: Optional[str] = None
    status: str

class ScanResultCreate(ScanResultBase):
    scan_id: int

class ScanResultResponse(ScanResultBase):
    id: int
    scan_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True 