from datetime import date, datetime, timedelta

from dateutil import parser as date_parser
from dateutil.rrule import rrulestr
from dateutil.tz import UTC

from api.events.errors.events_not_found_error import EventsNotFoundError
from api.events.repositories.event_repository import EventRepository
from api.system.schemas.event import Event, EventList
from api.users.errors.user_not_found_error import UserNotFoundError
from api.users.repositories.user_repository import UserRepository


class GetEventsForUserUseCase:
    def __init__(
        self,
        event_repository: EventRepository,
        user_repository: UserRepository,
    ) -> None:
        self.event_repository = event_repository
        self.user_repository = user_repository

    def execute(self, current_user: str) -> EventList:
        user = self.user_repository.find_by_email(current_user)

        if user is None:
            msg = "User not found"
            raise UserNotFoundError(msg)

        today = datetime.now(tz=UTC).date()
        start_date = today - timedelta(days=365)
        end_date = today + timedelta(days=365)

        events = self.event_repository.get_events(
            user.id,  # type: ignore  # noqa: PGH003
            start_date,
            end_date,
        )

        if events is None:
            msg = "Events not found"
            raise EventsNotFoundError(msg)

        events_with_rrule: list[Event] = []

        for event in events:
            if event.rrule is not None:
                events_with_rrule.extend(
                    self._expand_rrule(event, start_date, end_date),
                )
            else:
                events_with_rrule.append(event)

        validated_events: list[Event] = [
            Event.model_validate(event) for event in events_with_rrule
        ]

        return EventList(events=validated_events)

    def _expand_rrule(
        self,
        event: Event,
        start_date: date,
        end_date: date,
    ) -> list[Event]:
        dtstart = datetime.combine(event.date, event.start_time).replace(tzinfo=UTC)
        rule = rrulestr(event.rrule, dtstart=dtstart)

        start_dt = datetime.combine(start_date, event.start_time).replace(tzinfo=UTC)
        end_dt = datetime.combine(end_date, event.end_time).replace(tzinfo=UTC)

        occurrences = rule.between(start_dt, end_dt, inc=True)
        excluded = set()

        if event.exdate:
            for ex in event.exdate.split(","):
                excluded.add(date_parser.parse(ex).date())

        expanded: list[Event] = []
        for occ in occurrences:
            occ_date = occ.date()
            if occ_date == event.date or occ_date in excluded:
                continue

            expanded.append(
                Event(
                    id=event.id,
                    title=event.title,
                    description=event.description,
                    location=event.location,
                    date=occ_date,
                    start_time=event.start_time,
                    end_time=event.end_time,
                    rrule=event.rrule,
                    exdate=event.exdate,
                    colour=event.colour,
                ),
            )

        return expanded
