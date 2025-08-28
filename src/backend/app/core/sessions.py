"""
Securet Flow SSC - Simple Session Management
Basic session-based authentication
"""

import secrets
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.config import settings

# In-memory session storage (in production, use Redis)
sessions: Dict[str, Dict[str, Any]] = {}

security = HTTPBearer(auto_error=False)

def create_session(user_id: str, user_data: Dict[str, Any]) -> str:
    """Create a new session for a user"""
    session_id = secrets.token_urlsafe(32)
    expire_time = datetime.utcnow() + timedelta(seconds=settings.SESSION_EXPIRATION)
    
    sessions[session_id] = {
        "user_id": user_id,
        "user_data": user_data,
        "created_at": datetime.utcnow(),
        "expires_at": expire_time
    }
    
    return session_id

def get_session(session_id: str) -> Optional[Dict[str, Any]]:
    """Get session data by session ID"""
    if session_id not in sessions:
        return None
    
    session = sessions[session_id]
    if datetime.utcnow() > session["expires_at"]:
        del sessions[session_id]
        return None
    
    return session

def delete_session(session_id: str) -> bool:
    """Delete a session"""
    if session_id in sessions:
        del sessions[session_id]
        return True
    return False

def get_current_user():
    """Get current user (no authentication required)"""
    return {
        "id": "default_user",
        "email": "admin@securet-flow.com",
        "name": "Admin",
        "role": "admin"
    }

def cleanup_expired_sessions():
    """Clean up expired sessions"""
    current_time = datetime.utcnow()
    expired_sessions = [
        session_id for session_id, session in sessions.items()
        if current_time > session["expires_at"]
    ]
    
    for session_id in expired_sessions:
        del sessions[session_id] 