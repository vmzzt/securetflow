import asyncio
import time
import uuid
from typing import Dict, Optional
import logging
import os

from app.core.config import settings
import redis.asyncio as redis

logger = logging.getLogger(__name__)

USE_CELERY = os.getenv("USE_CELERY", "false").lower() == "true"
if USE_CELERY:
    try:
        from app.services.dast_tasks import run_dast_job  # type: ignore
    except Exception:
        run_dast_job = None

class DASTJob:
    def __init__(self, target_url: str, tool: str):
        self.id = str(uuid.uuid4())
        self.target_url = target_url
        self.tool = tool  # "zap" | "nuclei" | "both"
        self.status = "queued"
        self.progress = 0
        self.result: Optional[Dict] = None
        self.created_at = int(time.time())

class DASTService:
    def __init__(self):
        self.jobs: Dict[str, DASTJob] = {}
        try:
            self.redis = redis.from_url(settings.REDIS_URL, decode_responses=True)
        except Exception:
            self.redis = None

    async def submit(self, target_url: str, tool: str = "zap") -> str:
        job = DASTJob(target_url, tool)
        self.jobs[job.id] = job
        if USE_CELERY and run_dast_job:
            job.status = "running"
            task = run_dast_job.delay(target_url, tool)
            asyncio.create_task(self._watch_celery(job, task))
        else:
            asyncio.create_task(self._run(job))
        return job.id

    async def status(self, job_id: str) -> Optional[Dict]:
        job = self.jobs.get(job_id)
        if not job:
            return None
        return {
            "id": job.id,
            "target": job.target_url,
            "tool": job.tool,
            "status": job.status,
            "progress": job.progress,
            "result": job.result,
        }

    async def cancel(self, job_id: str) -> bool:
        job = self.jobs.get(job_id)
        if not job or job.status in ("completed", "failed"):
            return False
        job.status = "cancelled"
        return True

    async def _run(self, job: DASTJob) -> None:
        try:
            job.status = "running"
            for i in range(1, 11):
                if job.status == "cancelled":
                    return
                job.progress = i * 10
                await asyncio.sleep(0.5)
            # Stub result
            job.result = {
                "summary": {
                    "critical": 0,
                    "high": 1 if job.tool in ("zap", "both") else 0,
                    "medium": 2,
                    "low": 1,
                },
                "findings": [
                    {"id": "ZAP-001", "severity": "High", "title": "XSS Refletido", "url": job.target_url},
                ],
            }
            job.status = "completed"
        except Exception as e:
            job.status = "failed"
            logger.error(f"DAST job failed: {e}")

    async def _watch_celery(self, job: DASTJob, task):
        try:
            while not task.ready():
                if job.status == "cancelled":
                    return
                await asyncio.sleep(0.5)
            if task.successful():
                job.result = task.get()
                job.status = "completed"
            else:
                job.status = "failed"
        except Exception as e:
            job.status = "failed"
            logger.error(f"DAST celery watcher failed: {e}")


dast_service = DASTService() 