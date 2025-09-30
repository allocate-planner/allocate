from datetime import date as date_type
from datetime import time as time_type
from typing import Annotated

from pydantic import StringConstraints

from api.system.schemas.base import FrozenBaseModel


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

    date: date_type
    start_time: time_type
    end_time: time_type

    colour: Annotated[
        str | None,
        StringConstraints(
            strip_whitespace=True,
            max_length=256,
            pattern="^#(?:[0-9a-fA-F]{3}){1,2}$",
        ),
    ] = None

    rrule: str | None = None
    exdate: str | None = None
    repeated: bool = False


class Event(EventBase):
    id: int


class GetEvent(FrozenBaseModel):
    start_date: date_type
    end_date: date_type


class EventList(FrozenBaseModel):
    events: list[Event]


class DeleteEvent(FrozenBaseModel):
    event_id: int
    date: date_type | None = None


class EditEvent(FrozenBaseModel):
    title: (
        Annotated[str, StringConstraints(strip_whitespace=True, max_length=256)] | None
    ) = None
    description: (
        Annotated[str, StringConstraints(strip_whitespace=True, max_length=1024)] | None
    ) = None
    location: (
        Annotated[str, StringConstraints(strip_whitespace=True, max_length=256)] | None
    ) = None

    date: date_type | None = None
    start_time: time_type | None = None
    end_time: time_type | None = None

    colour: (
        Annotated[
            str | None,
            StringConstraints(
                strip_whitespace=True,
                max_length=256,
                pattern="^#(?:[0-9a-fA-F]{3}){1,2}$",
            ),
        ]
        | None
    ) = None

    previous_date: date_type | None = None
    previous_start_time: time_type | None = None
    previous_end_time: time_type | None = None
