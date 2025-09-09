"""
Securet Flow SSC - API Router
Main API router with all endpoints
"""

from fastapi import APIRouter
from app.api.v1.endpoints import auth, scans, targets, dashboard, users, vulnerabilities, reports
from app.api.v1.endpoints import roles
from app.api.v1.endpoints import profile
from app.api.v1.endpoints import ai, monitoring
from app.api.v1.endpoints import dast

api_router = APIRouter()

# Incluir routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(scans.router, prefix="/scans", tags=["scans"])
api_router.include_router(targets.router, prefix="/targets", tags=["targets"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(vulnerabilities.router, prefix="/vulnerabilities", tags=["vulnerabilities"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
api_router.include_router(roles.router, prefix="/roles", tags=["roles"])
api_router.include_router(profile.router, prefix="/profile", tags=["profile"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
api_router.include_router(monitoring.router, prefix="/monitoring", tags=["monitoring"])
api_router.include_router(dast.router, prefix="/dast", tags=["dast"]) 