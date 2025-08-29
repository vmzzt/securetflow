from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models import User, Scan, Target, ScanResult
from app.core.database import get_db
from app.core.auth import get_current_user
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/stats")
async def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obter estatísticas do dashboard"""
    try:
        # Total de scans
        total_scans = db.query(func.count(Scan.id)).filter(Scan.user_id == current_user.id).scalar()
        
        # Scans ativos
        active_scans = db.query(func.count(Scan.id)).filter(
            Scan.user_id == current_user.id,
            Scan.status == "running"
        ).scalar()
        
        # Scans completados
        completed_scans = db.query(func.count(Scan.id)).filter(
            Scan.user_id == current_user.id,
            Scan.status == "completed"
        ).scalar()
        
        # Total de targets
        total_targets = db.query(func.count(Target.id)).filter(Target.user_id == current_user.id).scalar()
        
        # Vulnerabilidades por severidade (mock - implementar lógica real)
        vulnerabilities = {
            "critical": 0,
            "high": 0,
            "medium": 0,
            "low": 0
        }
        
        # Scans recentes (últimos 10)
        recent_scans = db.query(Scan).filter(
            Scan.user_id == current_user.id
        ).order_by(Scan.created_at.desc()).limit(10).all()
        
        # Converter para dict
        recent_scans_data = []
        for scan in recent_scans:
            recent_scans_data.append({
                "id": scan.id,
                "name": scan.name,
                "status": scan.status,
                "scan_type": scan.scan_type,
                "created_at": scan.created_at.isoformat() if scan.created_at else None,
                "started_at": scan.started_at.isoformat() if scan.started_at else None,
                "completed_at": scan.completed_at.isoformat() if scan.completed_at else None
            })
        
        return {
            "totalScans": total_scans or 0,
            "activeScans": active_scans or 0,
            "completedScans": completed_scans or 0,
            "totalTargets": total_targets or 0,
            "vulnerabilities": vulnerabilities,
            "recentScans": recent_scans_data
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao obter estatísticas: {str(e)}"
        ) 