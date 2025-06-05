from datetime import date, time
from typing import Annotated

from pydantic import BaseModel, ConfigDict, EmailStr, StringConstraints


class FrozenBaseModel(BaseModel):
    model_config: ConfigDict = ConfigDict(
        frozen=True,
        extra="ignore",
        from_attributes=True,
    )


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


class EventBase(FrozenBaseModel):
    title: Annotated[
        str,
        StringConstraints(strip_whitespace=True, max_length=256),
    ]
    description: (
        Annotated[str, StringConstraints(strip_whitespace=True, max_length=1024)] | None
    ) = None
    location: (
        Annotated[str, StringConstraints(strip_whitespace=True, max_length=256)] | None
    ) = None

    date: date
    start_time: time
    end_time: time

    colour: Annotated[
        str | None,
        StringConstraints(
            strip_whitespace=True,
            max_length=256,
            pattern="^#(?:[0-9a-fA-F]{3}){1,2}$",
        ),
    ] = None


class Event(EventBase):
    id: int


class GetEvent(FrozenBaseModel):
    start_date: date
    end_date: date


class EventList(FrozenBaseModel):
    events: list[Event]
