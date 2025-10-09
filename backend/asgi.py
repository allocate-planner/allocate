import os

import uvicorn

from api import create_app

UVICORN_HOST = os.getenv("UVICORN_HOST", "127.0.0.1")
UVICORN_PORT = int(os.getenv("UVICORN_PORT", "5000"))

app = create_app()

if __name__ == "__main__":
    uvicorn.run(
        "asgi:app",
        host=UVICORN_HOST,
        port=UVICORN_PORT,
        access_log=True,
        reload=True,
    )
