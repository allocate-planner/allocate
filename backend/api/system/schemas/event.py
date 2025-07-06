from datetime import date, time
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
