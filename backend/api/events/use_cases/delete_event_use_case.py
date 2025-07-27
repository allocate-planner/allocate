from datetime import datetime

from api.events.errors.event_not_found_error import EventNotFoundError
from api.events.repositories.event_repository import EventRepository
from api.system.interfaces.use_cases import UseCase
from api.system.schemas.event import DeleteEvent
from api.users.errors.user_not_found_error import UserNotFoundError
from api.users.repositories.user_repository import UserRepository


class DeleteEventUseCase(UseCase):
    def __init__(
        self,
        event_repository: EventRepository,
        user_repository: UserRepository,
    ) -> None:
        self.event_repository = event_repository
        self.user_repository = user_repository

    def execute(self, event: DeleteEvent, current_user: str) -> None:
        user = self.user_repository.find_by_email(current_user)

        if user is None:
            msg = "User not found"
            raise UserNotFoundError(msg)

        db_event = self.event_repository.find_by_id(event.event_id)

        if db_event is None:
            msg = "Event not found"
            raise EventNotFoundError(msg)

        if db_event.user_id != user.id:  # type: ignore  # noqa: PGH003
            msg = "Event not found"
            raise EventNotFoundError(msg)

        if (
            db_event.rrule is not None
            and event.date is not None
            and event.date != db_event.date
        ):
            exdate_entry = datetime.combine(
                event.date,
                db_event.start_time,  # type: ignore  # noqa: PGH003
            ).strftime(  # type: ignore  # noqa: PGH003
                "%Y%m%dT%H%M%SZ",
            )
            self.event_repository.add_exdate(db_event, exdate_entry)
            return

        self.event_repository.delete(db_event)
