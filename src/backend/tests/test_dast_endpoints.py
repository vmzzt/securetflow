import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_dast_requires_auth():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        r = await ac.post("/api/v1/dast/submit", json={"target": "https://example.com", "tool": "zap"})
        assert r.status_code in (401, 403) 