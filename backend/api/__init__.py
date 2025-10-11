import logging
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.audio.controllers.audio_controller import audio
from api.config import config
from api.database import engine
from api.events.controllers.events_controller import events
from api.integrations.controllers.integration_controller import integrations
from api.middleware import error_handling_middleware, request_logging_middleware
from api.system.models.models import Base
from api.users.controllers.users_controller import users

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)


def create_app() -> FastAPI:
    production = os.environ.get("ALLOCATE_ENV") == "production"

    app = FastAPI()
    app_config = config

    app.middleware("http")(request_logging_middleware)
    app.middleware("http")(error_handling_middleware)

    if production:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=[
                "https://allocate.day",
                "https://www.allocate.day",
            ],
            allow_credentials=True,
            allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allow_headers=["Content-Type", "Authorization"],
        )
    else:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=["http://localhost:5173"],
            allow_credentials=True,
            allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allow_headers=["Content-Type", "Authorization"],
        )

    Base.metadata.create_all(bind=engine)

    app.include_router(audio, tags=["audio"])
    app.include_router(users, tags=["users"])
    app.include_router(events, tags=["events"])
    app.include_router(integrations, tags=["integrations"])

    app.state.config = app_config

    return app
