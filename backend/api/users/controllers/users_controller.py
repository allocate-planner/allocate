from fastapi import Depends, APIRouter, HTTPException
from fastapi.security import OAuth2PasswordRequestForm

from api.system.schemas import schemas

from api.users.use_cases.register_user_use_case import RegisterUserUseCase
from api.users.use_cases.login_user_use_case import LoginUserUseCase

from api.users.errors.user_already_exists import UserAlreadyExists
from api.users.errors.user_not_found import UserNotFound
from api.users.errors.invalid_credentials import InvalidCredentials

from api.users.dependencies import get_email_address_validator
from api.users.dependencies import get_password_validator

from api.users.dependencies import register_user_use_case
from api.users.dependencies import login_user_use_case

from api.users.validators import EmailAddressValidator
from api.users.validators import PasswordValidator


users = APIRouter()


@users.post("/api/v1/users", response_model=schemas.User)
def register_user(
    request: schemas.UserDetails,
    register_user_use_case: RegisterUserUseCase = Depends(register_user_use_case),
    email_address_validator: EmailAddressValidator = Depends(
        get_email_address_validator
    ),
    password_validator: PasswordValidator = Depends(get_password_validator),
):
    validation_email_errors = email_address_validator.validate_user_email_address(
        request.email_address
    )
    validation_password_errors = password_validator.validate_user_password(
        request.password
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
    except UserAlreadyExists as e:
        raise HTTPException(status_code=409, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@users.post("/api/v1/users/login", response_model=schemas.UserWithToken)
def authenticate_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    login_user_use_case: LoginUserUseCase = Depends(login_user_use_case),
):
    try:
        return login_user_use_case.execute(form_data)
    except UserNotFound as e:
        raise HTTPException(status_code=404, detail=str(e))
    except InvalidCredentials as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
