from typing import List
from typing_extensions import Annotated

from pydantic import BaseModel, ConfigDict, EmailStr, StringConstraints

from datetime import date, time


class FrozenBaseModel(BaseModel):
    model_config: ConfigDict = ConfigDict(
        frozen=True, extra="ignore", from_attributes=True
    )


class UserBase(FrozenBaseModel):
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
    description: Annotated[
        str,
        StringConstraints(strip_whitespace=True, max_length=1024),
    ]
    location: Annotated[
        str,
        StringConstraints(strip_whitespace=True, max_length=256),
    ]
    date: date
    start_time: time
    end_time: time


class Event(EventBase):
    id: int


class EventList(FrozenBaseModel):
    events: List[Event]
