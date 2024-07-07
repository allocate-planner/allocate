from typing import List, Any

from icalendar import Calendar

from fastapi import UploadFile

from api.events.repositories.event_repository import EventRepository
from api.users.repositories.user_repository import UserRepository

from api.events.use_cases.create_event_use_case import CreateEventUseCase

from api.system.schemas.schemas import EventBase

from api.users.errors.user_not_found import UserNotFound


class ImportEventsUseCase:
    def __init__(
        self, event_repository: EventRepository, user_repository: UserRepository
    ) -> None:
        self.event_repository = event_repository
        self.user_repository = user_repository

    def execute(
        self,
        current_user: str,
        file: UploadFile,
        create_event_use_case: CreateEventUseCase,
    ) -> List[EventBase]:
        user = self.user_repository.find_by_email(current_user)

        if user is None:
            raise UserNotFound("User not found")

        calendar_object = self._load_ICS(file)
        return self._traverse_calendar(
            calendar_object, create_event_use_case, current_user
        )

    def _load_ICS(self, file: UploadFile) -> Any:
        ics_content = file.file.read().decode("utf-8")

        return Calendar.from_ical(ics_content)

    def _traverse_calendar(
        self,
        calendar_object: Any,
        create_event_use_case: CreateEventUseCase,
        current_user: str,
    ) -> List[EventBase]:
        events: List = []

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

            event = EventBase(
                title=title,
                description=description,
                location=location,
                date=date,
                start_time=start_time,
                end_time=end_time,
                colour=CreateEventUseCase._random_background_colour(),
            )

            events.append(event)
            create_event_use_case.execute(event, current_user)

        return events
