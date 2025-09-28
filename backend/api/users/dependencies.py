from typing import Annotated

from fastapi import Depends

from api.config import Config
from api.dependencies import UserRepository, get_user_repository
from api.services.email_service import EmailService
from api.users.hashers.bcrypt_hasher import BCryptHasher
from api.users.use_cases.edit_user_use_case import EditUserUseCase
from api.users.use_cases.login_user_use_case import LoginUserUseCase
from api.users.use_cases.register_user_use_case import RegisterUserUseCase
from api.users.validators import EmailAddressValidator, PasswordValidator


def get_email_service() -> EmailService:
    return EmailService()


def get_bcrypt_hasher() -> BCryptHasher:
    return BCryptHasher()


def get_email_address_validator() -> EmailAddressValidator:
    return EmailAddressValidator()


def get_password_validator() -> PasswordValidator:
    return PasswordValidator()


def register_user_use_case(
    user_repository: Annotated[UserRepository, Depends(get_user_repository)],
    bcrypt_hasher: Annotated[BCryptHasher, Depends(get_bcrypt_hasher)],
    email_service: Annotated[EmailService, Depends(get_email_service)],
) -> RegisterUserUseCase:
    return RegisterUserUseCase(user_repository, bcrypt_hasher, email_service)


def login_user_use_case(
    user_repository: Annotated[UserRepository, Depends(get_user_repository)],
    bcrypt_hasher: Annotated[BCryptHasher, Depends(get_bcrypt_hasher)],
    config: Annotated[Config, Depends(Config)],
) -> LoginUserUseCase:
    return LoginUserUseCase(user_repository, bcrypt_hasher, config)


def edit_user_use_case(
    user_repository: Annotated[UserRepository, Depends(get_user_repository)],
    bcrypt_hasher: Annotated[BCryptHasher, Depends(get_bcrypt_hasher)],
) -> EditUserUseCase:
    return EditUserUseCase(user_repository, bcrypt_hasher)
