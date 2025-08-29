"""
Securet Flow SSC - API Router
Main API router with all endpoints
"""

from fastapi import APIRouter
from app.api.v1.endpoints import auth, scans, targets, dashboard

api_router = APIRouter()

# Incluir routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(scans.router, prefix="/scans", tags=["scans"])
api_router.include_router(targets.router, prefix="/targets", tags=["targets"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"]) 