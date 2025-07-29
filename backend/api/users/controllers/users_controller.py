from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm

from api.dependencies import get_current_user
from api.system.schemas.user import EditUser, User, UserDetails, UserWithToken
from api.users.dependencies import (
    edit_user_use_case,
    get_email_address_validator,
    get_password_validator,
    login_user_use_case,
    register_user_use_case,
)
from api.users.use_cases.edit_user_use_case import EditUserUseCase
from api.users.use_cases.login_user_use_case import LoginUserUseCase
from api.users.use_cases.register_user_use_case import RegisterUserUseCase
from api.users.validators import EmailAddressValidator, PasswordValidator

users = APIRouter()


@users.post("/api/v1/users")
def register_user(
    request: UserDetails,
    register_user_use_case: Annotated[
        RegisterUserUseCase,
        Depends(register_user_use_case),
    ],
    email_address_validator: Annotated[
        EmailAddressValidator,
        Depends(get_email_address_validator),
    ],
    password_validator: Annotated[PasswordValidator, Depends(get_password_validator)],
) -> User:
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

    return register_user_use_case.execute(request)


@users.post("/api/v1/users/login")
def authenticate_user(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    login_user_use_case: Annotated[LoginUserUseCase, Depends(login_user_use_case)],
) -> UserWithToken:
    return login_user_use_case.execute(form_data)


@users.put("/api/v1/users/edit")
def edit_user(
    request: EditUser,
    edit_user_use_case: Annotated[EditUserUseCase, Depends(edit_user_use_case)],
    current_user: Annotated[str, Depends(get_current_user)],
    password_validator: Annotated[PasswordValidator, Depends(get_password_validator)],
) -> User:
    if request.password is not None:
        validation_password_errors = password_validator.validate_user_password(
            request.password,
        )

        if validation_password_errors:
            raise HTTPException(
                status_code=400,
                detail=validation_password_errors,
            )

    return edit_user_use_case.execute(request, current_user)
