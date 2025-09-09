import pytest
from httpx import AsyncClient
from app.main import app
from app.core.database import SessionLocal
from app.models.user import User
from app.models.role import Role

@pytest.mark.asyncio
async def test_register_login_and_create_target_happy_path():
    username = "tester"
    password = "Passw0rd!"
    email = "tester@example.com"

    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Register (role viewer por padrão)
        r = await ac.post("/api/v1/auth/register", json={
            "username": username,
            "email": email,
            "password": password,
            "full_name": "Tester",
            "department": "QA"
        })
        assert r.status_code in (200, 201)

        # Login
        r = await ac.post("/api/v1/auth/login", data={"username": username, "password": password})
        assert r.status_code == 200
        token = r.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Como viewer, criar target deve falhar (403)
        r = await ac.post("/api/v1/targets/", headers=headers, json={
            "name": "Site",
            "host": "example.com",
            "protocol": "https",
            "port": 443,
            "description": "Site de testes"
        })
        assert r.status_code in (401, 403)

        # Promove para analyst diretamente no banco (simulação)
        with SessionLocal() as db:
            user = db.query(User).filter(User.username == username).first()
            analyst = db.query(Role).filter(Role.name == "analyst").first()
            if analyst and user:
                user.role_id = analyst.id
                db.commit()

        # Login novamente para garantir token válido
        r = await ac.post("/api/v1/auth/login", data={"username": username, "password": password})
        token = r.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Agora deve conseguir criar target
        r = await ac.post("/api/v1/targets/", headers=headers, json={
            "name": "Site",
            "host": "example.com",
            "protocol": "https",
            "port": 443,
            "description": "Site de testes"
        })
        assert r.status_code in (200, 201)

        # Listar targets deve retornar o criado
        r = await ac.get("/api/v1/targets/", headers=headers)
        assert r.status_code == 200
        data = r.json()
        assert any(t["host"] == "example.com" for t in data) 