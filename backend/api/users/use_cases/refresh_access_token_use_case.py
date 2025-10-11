from datetime import UTC, datetime, timedelta

import jwt

from api.config import Config
from api.system.interfaces.use_cases import UseCase
from api.system.schemas.user import AccessToken
from api.users.errors.refresh_token_error import RefreshTokenError


class RefreshAccessTokenUseCase(UseCase):
    def __init__(self, config: Config) -> None:
        self.config = config

    def execute(self, refresh_token: str) -> AccessToken:
        try:
            payload = jwt.decode(
                refresh_token,
                self.config.JWT_REFRESH_SECRET_KEY,
                algorithms=[self.config.JWT_ALGORITHM],
            )
        except jwt.PyJWTError as err:
            msg = "Invalid refresh token"
            raise RefreshTokenError(msg) from err

        subject = payload.get("sub")

        if not isinstance(subject, str) or not subject:
            msg = "Invalid refresh token"
            raise RefreshTokenError(msg)

        exp = datetime.now(UTC) + timedelta(
            seconds=self.config.JWT_ACCESS_TOKEN_EXPIRE_SECONDS,
        )

        access_token = jwt.encode(
            {"sub": subject, "exp": exp},
            self.config.JWT_SECRET_KEY,
            algorithm=self.config.JWT_ALGORITHM,
        )

        return AccessToken(access_token=access_token)
