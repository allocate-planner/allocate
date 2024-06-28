from typing import List

from api.system.schemas.schemas import EventList, Event

from api.events.repositories.event_repository import EventRepository
from api.users.repositories.user_repository import UserRepository

from api.users.errors.user_not_found import UserNotFound
from api.events.errors.events_not_found import EventsNotFound


class GetEventsForUserUseCase:
    def __init__(
        self, event_repository: EventRepository, user_repository: UserRepository
    ) -> None:
        self.event_repository = event_repository
        self.user_repository = user_repository

    def execute(
        self,
        current_user: str,
    ) -> EventList:
        user = self.user_repository.find_by_email(current_user)

        if user is None:
            raise UserNotFound("User not found")

        events = self.event_repository.get_events(user.id)  # type: ignore

        if events is None:
            raise EventsNotFound("Events not found")

        validated_events: List[Event] = [
            Event.model_validate(event) for event in events
        ]

        return EventList(events=validated_events)
