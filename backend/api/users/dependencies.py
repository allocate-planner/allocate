from fastapi import Depends

from api.dependencies import UserRepository

from api.users.hashers.bcrypt_hasher import BCryptHasher

from api.users.use_cases.register_user_use_case import RegisterUserUseCase
from api.users.use_cases.login_user_use_case import LoginUserUseCase

from api.users.validators import EmailAddressValidator
from api.users.validators import PasswordValidator

from api.config import Config

from api.dependencies import get_user_repository


def get_bcrypt_hasher() -> BCryptHasher:
    return BCryptHasher()


def get_email_address_validator() -> EmailAddressValidator:
    return EmailAddressValidator()


def get_password_validator() -> PasswordValidator:
    return PasswordValidator()


def register_user_use_case(
    user_repository: UserRepository = Depends(get_user_repository),
    bcrypt_hasher: BCryptHasher = Depends(get_bcrypt_hasher),
) -> RegisterUserUseCase:
    return RegisterUserUseCase(user_repository, bcrypt_hasher)


def login_user_use_case(
    user_repository: UserRepository = Depends(get_user_repository),
    bcrypt_hasher: BCryptHasher = Depends(get_bcrypt_hasher),
    config: Config = Depends(Config),
) -> LoginUserUseCase:
    return LoginUserUseCase(user_repository, bcrypt_hasher, config)
