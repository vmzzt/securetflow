"""
Securet Flow SSC - Vulnerabilities Endpoints
Vulnerability management endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import logging

from app.core.database import get_db
from app.core.security import get_current_user, require_permission
from app.models.vulnerability import Vulnerability
from app.schemas.vulnerability import (
    VulnerabilityCreate,
    VulnerabilityUpdate,
    VulnerabilityResponse,
)
from app.models.user import User

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/", response_model=List[VulnerabilityResponse])
@require_permission("read:vulnerabilities")
async def get_vulnerabilities(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    severity: Optional[str] = Query(None),
    status_q: Optional[str] = Query(None, alias="status"),
    target_id: Optional[int] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all vulnerabilities with filters"""
    try:
        query = db.query(Vulnerability)
        if severity:
            query = query.filter(Vulnerability.severity == severity)
        if status_q:
            query = query.filter(Vulnerability.status == status_q)
        if target_id:
            query = query.filter(Vulnerability.target_id == target_id)
        vulns = query.offset(skip).limit(limit).all()
        return vulns
    except Exception as e:
        logger.error(f"Error getting vulnerabilities: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.post("/", response_model=VulnerabilityResponse, status_code=status.HTTP_201_CREATED)
@require_permission("write:vulnerabilities")
async def create_vulnerability(
    vuln_in: VulnerabilityCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        vuln = Vulnerability(
            title=vuln_in.title,
            description=vuln_in.description,
            severity=vuln_in.severity,
            category=vuln_in.category,
            cvss=vuln_in.cvss,
            status=vuln_in.status or "open",
            solution=vuln_in.solution,
            references=vuln_in.references,
            cve=vuln_in.cve,
            target_id=vuln_in.target_id,
            user_id=current_user.id if current_user else None,
        )
        db.add(vuln)
        db.commit()
        db.refresh(vuln)
        return vuln
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating vulnerability: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")

@router.get("/{vuln_id}", response_model=VulnerabilityResponse)
@require_permission("read:vulnerabilities")
async def get_vulnerability(vuln_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    vuln = db.query(Vulnerability).filter(Vulnerability.id == vuln_id).first()
    if not vuln:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vulnerability not found")
    return vuln

@router.put("/{vuln_id}", response_model=VulnerabilityResponse)
@require_permission("write:vulnerabilities")
async def update_vulnerability(vuln_id: int, vuln_in: VulnerabilityUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    vuln = db.query(Vulnerability).filter(Vulnerability.id == vuln_id).first()
    if not vuln:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vulnerability not found")
    for field, value in vuln_in.model_dump(exclude_unset=True).items():
        setattr(vuln, field, value)
    db.commit()
    db.refresh(vuln)
    return vuln

@router.delete("/{vuln_id}")
@require_permission("write:vulnerabilities")
async def delete_vulnerability(vuln_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    vuln = db.query(Vulnerability).filter(Vulnerability.id == vuln_id).first()
    if not vuln:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vulnerability not found")
    db.delete(vuln)
    db.commit()
    return {"message": "Vulnerability deleted successfully"} 