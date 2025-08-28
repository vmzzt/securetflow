"""
Securet Flow SSC - API Router
Main API router with all endpoints
"""

from fastapi import APIRouter

from app.api.v1.endpoints import users, targets, scans, vulnerabilities, reports, ai
from app.api.v1 import godofreda

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(targets.router, prefix="/targets", tags=["targets"])
api_router.include_router(scans.router, prefix="/scans", tags=["scans"])
api_router.include_router(vulnerabilities.router, prefix="/vulnerabilities", tags=["vulnerabilities"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
api_router.include_router(godofreda.router) 