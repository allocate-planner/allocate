from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.security import OAuth2PasswordRequestForm

from api.config import config
from api.dependencies import get_current_user
from api.system.schemas.user import (
    AccessToken,
    EditUser,
    User,
    UserBase,
    UserDetails,
    UserWithToken,
)
from api.users.dependencies import (
    edit_user_use_case,
    get_email_address_validator,
    get_password_validator,
    login_user_use_case,
    refresh_access_token_use_case,
    register_user_use_case,
)
from api.users.use_cases.edit_user_use_case import EditUserUseCase
from api.users.use_cases.login_user_use_case import LoginUserUseCase
from api.users.use_cases.refresh_access_token_use_case import RefreshAccessTokenUseCase
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
    response: Response,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    login_user_use_case: Annotated[LoginUserUseCase, Depends(login_user_use_case)],
) -> UserWithToken:
    user_with_token = login_user_use_case.execute(form_data)

    secure_cookie = config.is_production
    samesite_cookie = "lax"

    response.set_cookie(
        key="refresh_token",
        value=user_with_token.refresh_token,
        httponly=True,
        secure=secure_cookie,
        samesite=samesite_cookie,
        max_age=config.JWT_REFRESH_TOKEN_EXPIRE_SECONDS,
        path="/api/v1/users/refresh",
    )

    return user_with_token


@users.post("/api/v1/users/refresh")
def refresh_access_token(
    request: Request,
    refresh_access_token_use_case: Annotated[
        RefreshAccessTokenUseCase,
        Depends(refresh_access_token_use_case),
    ],
) -> AccessToken:
    token = request.cookies.get("refresh_token")

    if not token:
        raise HTTPException(status_code=401, detail="Missing refresh token")

    return refresh_access_token_use_case.execute(token)


@users.put("/api/v1/users/edit")
def edit_user(
    request: EditUser,
    edit_user_use_case: Annotated[EditUserUseCase, Depends(edit_user_use_case)],
    current_user: Annotated[str, Depends(get_current_user)],
    password_validator: Annotated[PasswordValidator, Depends(get_password_validator)],
) -> UserBase:
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
