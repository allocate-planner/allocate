from datetime import datetime
from typing import Any

from dateutil.rrule import rrulestr
from fastapi import UploadFile
from icalendar import Calendar

from api.events.repositories.event_repository import EventRepository
from api.events.use_cases.create_event_use_case import CreateEventUseCase
from api.system.interfaces.use_cases import UseCase
from api.system.schemas.event import EventBase
from api.users.errors.user_not_found_error import UserNotFoundError
from api.users.repositories.user_repository import UserRepository


class ImportEventsUseCase(UseCase):
    def __init__(
        self,
        event_repository: EventRepository,
        user_repository: UserRepository,
    ) -> None:
        self.event_repository = event_repository
        self.user_repository = user_repository

    def execute(
        self,
        current_user: str,
        file: UploadFile,
        create_event_use_case: CreateEventUseCase,
    ) -> list[EventBase]:
        user = self.user_repository.find_by_email(current_user)

        if user is None:
            msg = "User not found"
            raise UserNotFoundError(msg)

        calendar_object = self._load_ics(file)
        return self._traverse_calendar(
            calendar_object,
            create_event_use_case,
            current_user,
        )

    def _load_ics(self, file: UploadFile) -> Any:  # noqa: ANN401
        ics_content = file.file.read().decode("utf-8")

        return Calendar.from_ical(ics_content)

    def _traverse_calendar(
        self,
        calendar_object: Any,  # noqa: ANN401
        create_event_use_case: CreateEventUseCase,
        current_user: str,
    ) -> list[EventBase]:
        events: list = []

        for event in calendar_object.walk("VEVENT"):
            summary = event.get("SUMMARY")
            description = event.get("DESCRIPTION")
            location = event.get("LOCATION")
            dt_start = event.get("DTSTART")
            dt_end = event.get("DTEND")

            if not all([summary, dt_start, dt_end]):
                continue

            event_start_date = (
                dt_start.dt.date() if isinstance(dt_start.dt, datetime) else dt_start.dt
            )
            event_end_date = (
                dt_end.dt.date() if isinstance(dt_end.dt, datetime) else dt_end.dt
            )

            if event_start_date != event_end_date:
                continue

            event_start_time: datetime = dt_start.dt
            event_end_time: datetime = dt_end.dt

            title = str(summary)[:256] if summary else "(no title)"

            description = str(description)[:1024] if description else None
            location = str(location)[:256] if location else None

            rrule_prop = event.get("RRULE")
            exdate_prop = event.get("EXDATE")

            rrule_text = ImportEventsUseCase.ical_text(rrule_prop, ";")
            exdate_text = ImportEventsUseCase.ical_text(exdate_prop, ",")

            if rrule_text:
                rrulestr(rrule_text)

            event = EventBase(  # noqa: PLW2901
                title=title,
                description=description,
                location=location,
                date=event_start_time.date(),
                start_time=event_start_time.time(),
                end_time=event_end_time.time(),
                colour=CreateEventUseCase.random_background_colour(),
                rrule=rrule_text,
                exdate=exdate_text,
            )

            events.append(event)
            create_event_use_case.execute(event, current_user)

        return events

    @staticmethod
    def ical_text(value: Any, join_sep: str = ",") -> str | None:  # noqa: ANN401
        if value is None:
            return None
        if isinstance(value, list):
            return join_sep.join(v.to_ical().decode() for v in value)
        return value.to_ical().decode()
