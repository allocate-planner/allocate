from typing import Annotated

import jwt
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jwt import PyJWTError
from sqlalchemy.orm import Session

from api.config import config
from api.database import get_db
from api.events.repositories.event_repository import EventRepository
from api.integrations.repositories.integration_repository import (
    IntegrationRepository,
)
from api.users.errors.invalid_token_error import InvalidTokenError
from api.users.errors.missing_token_error import MissingTokenError
from api.users.errors.refresh_token_error import RefreshTokenError
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


def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]) -> str:
    if not token:
        raise MissingTokenError

    if not config.JWT_SECRET_KEY:
        raise HTTPException(status_code=500, detail="Server misconfiguration")

    try:
        payload = jwt.decode(
            token,
            config.JWT_SECRET_KEY,
            algorithms=[config.JWT_ALGORITHM],
        )
    except PyJWTError as err:
        raise InvalidTokenError from err
    else:
        subject = payload.get("sub")

        if not isinstance(subject, str) or not subject:
            msg = "Invalid refresh token"
            raise RefreshTokenError(msg)

        return subject
