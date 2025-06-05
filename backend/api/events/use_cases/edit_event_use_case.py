from api.events.errors.event_not_found_error import EventNotFoundError
from api.events.repositories.event_repository import EventRepository
from api.system.schemas.schemas import Event as EventSchema
from api.system.schemas.schemas import EventBase
from api.users.errors.user_not_found_error import UserNotFoundError
from api.users.repositories.user_repository import UserRepository


class EditEventUseCase:
    def __init__(
        self,
        event_repository: EventRepository,
        user_repository: UserRepository,
    ) -> None:
        self.event_repository = event_repository
        self.user_repository = user_repository

    def execute(
        self,
        event_id: int,
        request: EventBase,
        current_user: str,
    ) -> EventSchema:
        user = self.user_repository.find_by_email(current_user)

        if user is None:
            msg = "User not found"
            raise UserNotFoundError(msg)

        event = self.event_repository.find_by_id(event_id)

        if event is None:
            msg = "Event not found"
            raise EventNotFoundError(msg)

        return self.event_repository.edit(event, request)
