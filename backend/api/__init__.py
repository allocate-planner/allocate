from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.audio.controllers.audio_controller import audio


def create_app() -> FastAPI:
    app = FastAPI()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(audio, tags=["audio"])

    return app
