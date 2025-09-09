import json
import hashlib
from typing import Any, Callable, Optional
import asyncio
import redis.asyncio as redis

from app.core.config import settings


class RedisCache:
    def __init__(self, url: str):
        self.client = redis.from_url(url, decode_responses=True)

    @staticmethod
    def _make_key(prefix: str, *parts: Any) -> str:
        raw = prefix + ":" + ":".join(map(lambda p: hashlib.sha256(str(p).encode()).hexdigest(), parts))
        return raw

    async def get_json(self, key: str) -> Optional[Any]:
        data = await self.client.get(key)
        if not data:
            return None
        return json.loads(data)

    async def set_json(self, key: str, value: Any, ttl_seconds: int) -> None:
        await self.client.setex(key, ttl_seconds, json.dumps(value))

    async def invalidate_prefix(self, prefix: str) -> None:
        pattern = prefix + "*"
        async for k in self.client.scan_iter(pattern):
            await self.client.delete(k)


cache = RedisCache(settings.REDIS_URL) 