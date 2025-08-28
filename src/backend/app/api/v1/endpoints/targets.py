"""
Securet Flow SSC - Targets Endpoints
Target management endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
import logging

from app.core.database import get_db
from app.core.security import get_current_user, require_permission
from app.models.target import Target
from app.models.user import User

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/", response_model=List[dict])
@require_permission("read:targets")
async def get_targets(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    category: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all targets with filters"""
    try:
        targets = await Target.get_all(db, skip=skip, limit=limit, category=category, status=status)
        return [target.to_dict() for target in targets]
    except Exception as e:
        logger.error(f"Error getting targets: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.get("/{target_id}", response_model=dict)
@require_permission("read:targets")
async def get_target(
    target_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get target by ID"""
    try:
        target = await Target.get_by_id(db, target_id)
        if not target:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Target not found"
            )
        return target.to_dict()
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting target {target_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.post("/", response_model=dict)
@require_permission("write:targets")
async def create_target(
    target_data: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create new target"""
    try:
        # Add owner_id to target data
        target_data["owner_id"] = current_user.id
        
        target = await Target.create(db, **target_data)
        return target.to_dict()
    except Exception as e:
        logger.error(f"Error creating target: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.put("/{target_id}", response_model=dict)
@require_permission("write:targets")
async def update_target(
    target_id: int,
    target_data: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update target"""
    try:
        target = await Target.get_by_id(db, target_id)
        if not target:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Target not found"
            )
        
        updated_target = await target.update(db, **target_data)
        return updated_target.to_dict()
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating target {target_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.delete("/{target_id}")
@require_permission("write:targets")
async def delete_target(
    target_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete target"""
    try:
        target = await Target.get_by_id(db, target_id)
        if not target:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Target not found"
            )
        
        await target.delete(db)
        return {"message": "Target deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting target {target_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        ) 