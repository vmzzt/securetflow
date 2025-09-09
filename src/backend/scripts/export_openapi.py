import json
import sys
from pathlib import Path
from app.main import app

try:
    import yaml  # type: ignore
except Exception:
    yaml = None


def main():
    out_dir = Path("openapi")
    out_dir.mkdir(exist_ok=True)
    schema = app.openapi()
    (out_dir / "openapi.json").write_text(json.dumps(schema, indent=2), encoding="utf-8")
    if yaml:
        (out_dir / "openapi.yaml").write_text(yaml.safe_dump(schema, sort_keys=False), encoding="utf-8")
    print("OpenAPI exportado em ./openapi/")


if __name__ == "__main__":
    main() 