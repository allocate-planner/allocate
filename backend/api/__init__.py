from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.audio.controllers.audio_controller import audio

from api.config import DevelopmentConfig
from api.database import engine
from api.system.models.models import Base


def create_app() -> FastAPI:
    app = FastAPI()
    config = DevelopmentConfig()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    Base.metadata.create_all(bind=engine)

    app.include_router(audio, tags=["audio"])
    app.state.config = config

    return app
