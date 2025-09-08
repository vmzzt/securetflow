"""
Securet Flow SSC - Reports Endpoints
Report generation endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import logging

from app.core.database import get_db
from app.core.security import get_current_user, require_permission
from app.models.user import User
from app.models.report import Report
from app.schemas.report import ReportCreate, ReportUpdate, ReportResponse

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/", response_model=List[ReportResponse])
@require_permission("read:reports")
async def get_reports(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    type: Optional[str] = Query(None, alias="report_type"),
    target_id: Optional[int] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all reports with filters"""
    try:
        query = db.query(Report)
        if type:
            query = query.filter(Report.report_type == type)
        if target_id:
            query = query.filter(Report.scan_id == target_id)  # simplistic link via scan
        reports = query.offset(skip).limit(limit).all()
        return reports
    except Exception as e:
        logger.error(f"Error getting reports: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.post("/", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
@require_permission("write:reports")
async def create_report(
    report_in: ReportCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        report = Report(
            title=report_in.title,
            description=report_in.description,
            report_type=report_in.report_type,
            content=report_in.content,
            user_id=current_user.id if current_user else None,
            scan_id=report_in.scan_id,
            status="draft",
        )
        db.add(report)
        db.commit()
        db.refresh(report)
        return report
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating report: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.get("/{report_id}", response_model=ReportResponse)
@require_permission("read:reports")
async def get_report(report_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
    return report

@router.put("/{report_id}", response_model=ReportResponse)
@require_permission("write:reports")
async def update_report(report_id: int, report_in: ReportUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
    for field, value in report_in.model_dump(exclude_unset=True).items():
        setattr(report, field, value)
    db.commit()
    db.refresh(report)
    return report

@router.delete("/{report_id}")
@require_permission("write:reports")
async def delete_report(report_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
    db.delete(report)
    db.commit()
    return {"message": "Report deleted successfully"} 