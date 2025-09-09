"""
Securet Flow SSC - Logging Configuration
Centralized logging setup
"""

import logging
import logging.config
import sys
from pathlib import Path
from app.core.config import settings
import os

class LokiHandler(logging.Handler):
    def __init__(self, loki_url: str):
        super().__init__()
        self.loki_url = loki_url
        try:
            import requests  # type: ignore
            self.requests = requests
        except Exception:
            self.requests = None

    def emit(self, record: logging.LogRecord) -> None:
        if not self.requests:
            return
        try:
            payload = {
                "streams": [
                    {
                        "stream": {"app": "securetflow"},
                        "values": [[str(int(record.created * 1e9)), self.format(record)]],
                    }
                ]
            }
            self.requests.post(self.loki_url, json=payload, timeout=0.5)
        except Exception:
            pass


def setup_logging():
    """Setup logging configuration"""
    
    # Choose logs directory (default ./logs; can be overridden for containers)
    logs_dir_env = os.getenv("LOG_DIR", "logs")
    log_dir = Path(logs_dir_env)
    log_dir.mkdir(parents=True, exist_ok=True)
    
    loki_url = os.getenv("LOKI_URL")

    # Logging configuration
    logging_config = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "default": {
                "format": settings.LOG_FORMAT,
                "datefmt": "%Y-%m-%d %H:%M:%S"
            },
            "json": {
                "format": '{"timestamp": "%(asctime)s", "level": "%(levelname)s", "name": "%(name)s", "message": "%(message)s"}',
                "datefmt": "%Y-%m-%dT%H:%M:%S"
            }
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "level": "INFO",
                "formatter": "default",
                "stream": sys.stdout
            },
            "file": {
                "class": "logging.handlers.RotatingFileHandler",
                "level": "DEBUG",
                "formatter": "default",
                "filename": str(log_dir / "securet-flow.log"),
                "maxBytes": 10485760,  # 10MB
                "backupCount": 5
            },
            "error_file": {
                "class": "logging.handlers.RotatingFileHandler",
                "level": "ERROR",
                "formatter": "default",
                "filename": str(log_dir / "securet-flow-error.log"),
                "maxBytes": 10485760,  # 10MB
                "backupCount": 5
            }
        },
        "loggers": {
            "": {  # Root logger
                "handlers": ["console", "file", "error_file"] + (["loki"] if loki_url else []),
                "level": settings.LOG_LEVEL,
                "propagate": False
            },
            "app": {
                "handlers": ["console", "file", "error_file"] + (["loki"] if loki_url else []),
                "level": "DEBUG",
                "propagate": False
            },
            "uvicorn": {
                "handlers": ["console", "file"],
                "level": "INFO",
                "propagate": False
            },
            "uvicorn.access": {
                "handlers": ["console", "file"],
                "level": "INFO",
                "propagate": False
            }
        }
    }

    if loki_url:
        logging_config["handlers"]["loki"] = {
            "()": "app.core.logging.LokiHandler",
            "level": "INFO",
            "formatter": "default",
            "loki_url": loki_url,
        }
    
    # Apply configuration
    logging.config.dictConfig(logging_config)
    
    # Set specific logger levels
    logging.getLogger("uvicorn").setLevel(logging.INFO)
    logging.getLogger("uvicorn.access").setLevel(logging.INFO)
    
    # Create logger
    logger = logging.getLogger(__name__)
    logger.info("Logging configuration initialized")
    
    return logger 