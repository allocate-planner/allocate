from datetime import datetime

from api.events.errors.event_not_found_error import EventNotFoundError
from api.events.errors.recurring_event_edit_error import RecurringEventEditError
from api.events.repositories.event_repository import EventRepository
from api.system.interfaces.use_cases import UseCase
from api.system.models.models import Event as EventModel
from api.system.schemas.event import EditEvent as EditEventSchema
from api.system.schemas.event import Event as EventSchema
from api.system.schemas.event import EventBase
from api.users.errors.user_not_found_error import UserNotFoundError
from api.users.repositories.user_repository import UserRepository


class EditEventUseCase(UseCase):
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
        request: EditEventSchema,
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

        if event.user_id != user.id:  # type: ignore  # noqa: PGH003
            msg = "Event not found"
            raise EventNotFoundError(msg)

        if event.rrule is None or event.rrule == "DNR":  # type: ignore  # noqa: PGH003
            updated_fields = self._merge_with_existing_event(event, request)
            self.event_repository.edit(event, updated_fields)
            return EventSchema.model_validate(event)

        if request.previous_date is not None and request.previous_date == event.date:  # type: ignore  # noqa: PGH003
            raise RecurringEventEditError

        if request.previous_date is not None:
            exdate_entry = datetime.combine(
                request.previous_date,
                request.previous_start_time or event.start_time,  # type: ignore  # noqa: PGH003
            ).strftime("%Y%m%dT%H%M%SZ")

            self.event_repository.add_exdate(event, exdate_entry)

            new_event = EventModel(
                title=request.title if request.title else event.title,  # type: ignore  # noqa: PGH003
                description=request.description
                if request.description
                else event.description,  # type: ignore  # noqa: PGH003
                location=request.location if request.location else event.location,  # type: ignore  # noqa: PGH003
                date=request.previous_date,  # type: ignore  # noqa: PGH003
                start_time=request.start_time
                if request.start_time
                else event.start_time,  # type: ignore  # noqa: PGH003
                end_time=request.end_time if request.end_time else event.end_time,  # type: ignore  # noqa: PGH003
                colour=request.colour if request.colour else event.colour,  # type: ignore  # noqa: PGH003
                user_id=event.user_id,
                user=event.user,
            )

            self.event_repository.add(new_event)
            return EventSchema.model_validate(new_event)

        raise RecurringEventEditError

    def _merge_with_existing_event(
        self, event: EventModel, request: EditEventSchema
    ) -> EventBase:
        return EventBase(
            title=request.title if request.title else event.title,  # type: ignore  # noqa: PGH003
            description=request.description
            if request.description
            else event.description,  # type: ignore  # noqa: PGH003
            location=request.location if request.location else event.location,  # type: ignore  # noqa: PGH003
            date=request.date if request.date else event.date,  # type: ignore  # noqa: PGH003
            start_time=request.start_time if request.start_time else event.start_time,  # type: ignore  # noqa: PGH003
            end_time=request.end_time if request.end_time else event.end_time,  # type: ignore  # noqa: PGH003
            colour=request.colour if request.colour else event.colour,  # type: ignore  # noqa: PGH003
        )
