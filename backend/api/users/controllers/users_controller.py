from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm

from api.system.schemas import schemas
from api.users.dependencies import (
    get_email_address_validator,
    get_password_validator,
    login_user_use_case,
    register_user_use_case,
)
from api.users.errors.invalid_credentials_error import InvalidCredentialsError
from api.users.errors.user_already_exists_error import UserAlreadyExistsError
from api.users.errors.user_not_found_error import UserNotFoundError
from api.users.use_cases.login_user_use_case import LoginUserUseCase
from api.users.use_cases.register_user_use_case import RegisterUserUseCase
from api.users.validators import EmailAddressValidator, PasswordValidator

users = APIRouter()


@users.post("/api/v1/users", response_model=schemas.User)
def register_user(
    request: schemas.UserDetails,
    register_user_use_case: Annotated[
        RegisterUserUseCase,
        Depends(register_user_use_case),
    ],
    email_address_validator: Annotated[
        EmailAddressValidator,
        Depends(get_email_address_validator),
    ],
    password_validator: Annotated[PasswordValidator, Depends(get_password_validator)],
) -> schemas.User:
    validation_email_errors = email_address_validator.validate_user_email_address(
        request.email_address,
    )
    validation_password_errors = password_validator.validate_user_password(
        request.password,
    )

    if validation_email_errors:
        raise HTTPException(
            status_code=400,
            detail=validation_email_errors,
        )

    if validation_password_errors:
        raise HTTPException(
            status_code=400,
            detail=validation_password_errors,
        )

    try:
        return register_user_use_case.execute(request)
    except UserAlreadyExistsError as e:
        raise HTTPException(status_code=409, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@users.post("/api/v1/users/login", response_model=schemas.UserWithToken)
def authenticate_user(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    login_user_use_case: Annotated[LoginUserUseCase, Depends(login_user_use_case)],
) -> schemas.UserWithToken:
    try:
        return login_user_use_case.execute(form_data)
    except UserNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e)) from e
    except InvalidCredentialsError as e:
        raise HTTPException(status_code=401, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
