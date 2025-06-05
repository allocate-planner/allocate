from typing import Any

from fastapi import UploadFile
from icalendar import Calendar

from api.events.repositories.event_repository import EventRepository
from api.events.use_cases.create_event_use_case import CreateEventUseCase
from api.system.schemas.schemas import EventBase
from api.users.errors.user_not_found_error import UserNotFoundError
from api.users.repositories.user_repository import UserRepository


class ImportEventsUseCase:
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

            if dt_start.dt.date() != dt_end.dt.date():
                continue

            title = str(summary)[:256]
            date = dt_start.dt.strftime("%Y-%m-%d")
            start_time = dt_start.dt.strftime("%H:%M")
            end_time = dt_end.dt.strftime("%H:%M")

            description = str(description)[:1024] if description else None
            location = str(location)[:256] if location else None

            event = EventBase(  # noqa: PLW2901
                title=title,
                description=description,
                location=location,
                date=date,
                start_time=start_time,
                end_time=end_time,
                colour=CreateEventUseCase.random_background_colour(),
            )

            events.append(event)
            create_event_use_case.execute(event, current_user)

        return events
