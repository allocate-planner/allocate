from typing import Annotated

import jwt
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from jwt import PyJWTError
from sqlalchemy.orm import Session

from api.config import Config
from api.database import get_db
from api.events.repositories.event_repository import EventRepository
from api.integrations.repositories.integration_repository import IntegrationRepository
from api.users.repositories.user_repository import UserRepository

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/users/login", scheme_name="JWT")


def get_user_repository(db: Annotated[Session, Depends(get_db)]) -> UserRepository:
    return UserRepository(db)


def get_event_repository(db: Annotated[Session, Depends(get_db)]) -> EventRepository:
    return EventRepository(db)


def get_integration_repository(
    db: Annotated[Session, Depends(get_db)],
) -> IntegrationRepository:
    return IntegrationRepository(db)


def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]) -> str | None:
    if not token:
        return None

    try:
        if Config.JWT_SECRET_KEY:
            payload = jwt.decode(
                token,
                Config.JWT_SECRET_KEY,
                algorithms=[Config.JWT_ALGORITHM],
            )

            if payload is not None:
                user_email = payload.get("sub")

                return str(user_email)
        return None  # noqa: TRY300
    except PyJWTError:
        return None
