import jwt

from fastapi.security import OAuth2PasswordRequestForm

from datetime import datetime, timedelta, timezone

from api.system.schemas.schemas import UserWithToken

from api.users.repositories.user_repository import UserRepository

from api.users.errors.user_not_found import UserNotFound
from api.users.errors.invalid_credentials import InvalidCredentials

from api.users.hashers.bcrypt_hasher import BCryptHasher

from api.config import Config


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
            raise UserNotFound("User not found")

        if not self.bcrypt_hasher.check(str(user.password), form_data.password):
            raise InvalidCredentials("Invalid Credentials provided")

        access_token = self.create_access_token(str(user.email_address))
        refresh_token = self.create_refresh_token(str(user.email_address))

        user_with_token = UserWithToken(
            id=user.id,
            access_token=access_token,
            refresh_token=refresh_token,
            email_address=str(user.email_address),
        )

        return user_with_token

    def create_access_token(self, subject: str) -> str:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=self.config.JWT_ACCESS_TOKEN_EXPIRE_MINUTES
        )

        expiry_and_subject = {"exp": expire, "sub": str(subject)}

        encoded_access_token = jwt.encode(
            expiry_and_subject,
            self.config.JWT_SECRET_KEY,
            algorithm=self.config.JWT_ALGORITHM,
        )

        return encoded_access_token

    def create_refresh_token(self, subject: str) -> str:
        expires_delta = datetime.now(timezone.utc) + timedelta(
            minutes=self.config.JWT_REFRESH_TOKEN_EXPIRE_MINUTES
        )

        expiry_and_subject = {"exp": expires_delta, "sub": str(subject)}

        encoded_refresh_token = jwt.encode(
            expiry_and_subject,
            self.config.JWT_REFRESH_SECRET_KEY,
            self.config.JWT_ALGORITHM,
        )

        return encoded_refresh_token
