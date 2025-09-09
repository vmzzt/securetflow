from celery import Celery
import os

CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL", "redis://redis:6379/0")
CELERY_BACKEND_URL = os.getenv("CELERY_BACKEND_URL", "redis://redis:6379/1")

celery_app = Celery(
    "securetflow_dast",
    broker=CELERY_BROKER_URL,
    backend=CELERY_BACKEND_URL,
)

@celery_app.task(name="dast.run")
def run_dast_job(target_url: str, tool: str = "zap") -> dict:
    # Placeholder: aqui conectaremos ZAP/Nuclei
    # Simula execução
    import time
    time.sleep(2)
    return {
        "summary": {"critical": 0, "high": 1 if tool in ("zap", "both") else 0, "medium": 2, "low": 1},
        "findings": [{"id": "STUB-1", "severity": "High", "title": "Demo", "url": target_url}],
    } 