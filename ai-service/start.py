"""Deployment entrypoint; model, catalog and ranking remain in api.py."""
import os
from pathlib import Path
import uvicorn


def main():
    try:
        port = int(os.environ.get("PORT", "8000"))
        if not 1 <= port <= 65535:
            raise ValueError()
    except ValueError:
        raise SystemExit("PORT must be an integer between 1 and 65535.") from None
    uvicorn.run("api:app", host="0.0.0.0", port=port, workers=1,
                app_dir=str(Path(__file__).resolve().parent))


if __name__ == "__main__":
    main()
