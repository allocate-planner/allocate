from api.events.errors.events_not_found_error import EventsNotFoundError
from api.events.repositories.event_repository import EventRepository
from api.system.schemas.event import Event, EventList, GetEvent
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

    def execute(self, current_user: str, request: GetEvent) -> EventList:
        user = self.user_repository.find_by_email(current_user)

        if user is None:
            msg = "User not found"
            raise UserNotFoundError(msg)

        events = self.event_repository.get_events(
            user.id,  # type: ignore  # noqa: PGH003
            request.start_date,
            request.end_date,
        )

        if events is None:
            msg = "Events not found"
            raise EventsNotFoundError(msg)

        validated_events: list[Event] = [
            Event.model_validate(event) for event in events
        ]

        return EventList(events=validated_events)
