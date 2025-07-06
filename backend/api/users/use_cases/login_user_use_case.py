from datetime import UTC, datetime, timedelta

import jwt
from fastapi.security import OAuth2PasswordRequestForm

from api.config import Config
from api.system.schemas.user import UserWithToken
from api.users.errors.invalid_credentials_error import InvalidCredentialsError
from api.users.errors.user_not_found_error import UserNotFoundError
from api.users.hashers.bcrypt_hasher import BCryptHasher
from api.users.repositories.user_repository import UserRepository


class LoginUserUseCase:
    def __init__(
        self,
        user_repository: UserRepository,
        bcrypt_hasher: BCryptHasher,
        config: Config,
    ) -> None:
        self.user_repository = user_repository
        self.bcrypt_hasher = bcrypt_hasher
        self.config = config

    def execute(self, form_data: OAuth2PasswordRequestForm) -> UserWithToken:
        user = self.user_repository.find_by_email(form_data.username)

        if user is None:
            msg = "User not found."
            raise UserNotFoundError(msg)

        if not self.bcrypt_hasher.check(str(user.password), form_data.password):
            msg = "Invalid Credentials provided."
            raise InvalidCredentialsError(msg)

        access_token = self.create_access_token(str(user.email_address))
        refresh_token = self.create_refresh_token(str(user.email_address))

        return UserWithToken(
            id=user.id,  # type: ignore  # noqa: PGH003
            access_token=access_token,
            refresh_token=refresh_token,
            first_name=str(user.first_name),
            last_name=str(user.last_name),
            email_address=str(user.email_address),
        )

    def create_access_token(self, subject: str) -> str:
        expire = datetime.now(UTC) + timedelta(
            minutes=self.config.JWT_ACCESS_TOKEN_EXPIRE_MINUTES,
        )

        expiry_and_subject = {"exp": expire, "sub": str(subject)}

        return jwt.encode(
            expiry_and_subject,
            self.config.JWT_SECRET_KEY,  # type: ignore  # noqa: PGH003
            algorithm=self.config.JWT_ALGORITHM,
        )

    def create_refresh_token(self, subject: str) -> str:
        expires_delta = datetime.now(UTC) + timedelta(
            minutes=self.config.JWT_REFRESH_TOKEN_EXPIRE_MINUTES,
        )

        expiry_and_subject = {"exp": expires_delta, "sub": str(subject)}

        return jwt.encode(
            expiry_and_subject,
            self.config.JWT_REFRESH_SECRET_KEY,  # type: ignore  # noqa: PGH003
            self.config.JWT_ALGORITHM,
        )
