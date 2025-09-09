import pytest
from httpx import AsyncClient
from app.main import app

# Nota: estes testes assumem rotas /api/v1/auth e /api/v1/targets disponíveis

@pytest.mark.asyncio
async def test_login_fails_with_invalid_credentials():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        r = await ac.post("/api/v1/auth/login", data={"username": "nouser", "password": "bad"})
        assert r.status_code in (400, 401)

@pytest.mark.asyncio
async def test_targets_requires_auth():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        r = await ac.get("/api/v1/targets/")
        assert r.status_code in (401, 403) 