from pydantic import BaseModel, validator, HttpUrl
from typing import Optional
from datetime import datetime

class TargetBase(BaseModel):
    name: str
    host: str
    port: Optional[int] = None
    protocol: str = "http"
    description: Optional[str] = None

class TargetCreate(TargetBase):
    @validator('name')
    def validate_name(cls, v):
        if len(v.strip()) < 2:
            raise ValueError('Target name must be at least 2 characters long')
        return v.strip()
    
    @validator('host')
    def validate_host(cls, v):
        if not v or len(v.strip()) < 1:
            raise ValueError('Host cannot be empty')
        return v.strip()
    
    @validator('protocol')
    def validate_protocol(cls, v):
        allowed_protocols = ['http', 'https', 'ftp', 'ssh', 'tcp', 'udp']
        if v not in allowed_protocols:
            raise ValueError(f'Protocol must be one of: {allowed_protocols}')
        return v
    
    @validator('port')
    def validate_port(cls, v):
        if v is not None and (v < 1 or v > 65535):
            raise ValueError('Port must be between 1 and 65535')
        return v

class TargetUpdate(BaseModel):
    name: Optional[str] = None
    host: Optional[str] = None
    port: Optional[int] = None
    protocol: Optional[str] = None
    description: Optional[str] = None
    
    @validator('name')
    def validate_name(cls, v):
        if v is not None and len(v.strip()) < 2:
            raise ValueError('Target name must be at least 2 characters long')
        return v.strip() if v else v
    
    @validator('host')
    def validate_host(cls, v):
        if v is not None and len(v.strip()) < 1:
            raise ValueError('Host cannot be empty')
        return v.strip() if v else v
    
    @validator('protocol')
    def validate_protocol(cls, v):
        if v is not None:
            allowed_protocols = ['http', 'https', 'ftp', 'ssh', 'tcp', 'udp']
            if v not in allowed_protocols:
                raise ValueError(f'Protocol must be one of: {allowed_protocols}')
        return v
    
    @validator('port')
    def validate_port(cls, v):
        if v is not None and (v < 1 or v > 65535):
            raise ValueError('Port must be between 1 and 65535')
        return v

class TargetResponse(TargetBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True 