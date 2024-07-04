from api.events.repositories.event_repository import EventRepository
from api.users.repositories.user_repository import UserRepository

from api.users.errors.user_not_found import UserNotFound
from api.events.errors.event_not_found import EventNotFound


class DeleteEventUseCase:
    def __init__(
        self, event_repository: EventRepository, user_repository: UserRepository
    ) -> None:
        self.event_repository = event_repository
        self.user_repository = user_repository

    def execute(
        self,
        event_id: int,
        current_user: str,
    ) -> None:
        user = self.user_repository.find_by_email(current_user)

        if user is None:
            raise UserNotFound("User not found")

        event = self.event_repository.find_by_id(event_id)

        if event is None:
            raise EventNotFound("Event not found")

        self.event_repository.delete(event)
