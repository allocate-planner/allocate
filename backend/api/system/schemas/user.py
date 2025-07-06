from typing import Annotated

from pydantic import EmailStr, StringConstraints

from api.system.schemas.base import FrozenBaseModel


class UserBase(FrozenBaseModel):
    first_name: Annotated[
        str,
        StringConstraints(strip_whitespace=True, max_length=64),
    ]
    last_name: Annotated[
        str,
        StringConstraints(strip_whitespace=True, max_length=64),
    ]
    email_address: Annotated[
        EmailStr,
        StringConstraints(strip_whitespace=True, max_length=256),
    ]


class UserDetails(UserBase):
    password: Annotated[
        str,
        StringConstraints(strip_whitespace=True, max_length=256),
    ]


class User(UserBase):
    id: int


class UserWithToken(UserBase):
    id: int

    access_token: str
    refresh_token: str
