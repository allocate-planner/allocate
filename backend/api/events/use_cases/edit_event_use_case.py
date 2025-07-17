from datetime import datetime

from api.events.errors.event_not_found_error import EventNotFoundError
from api.events.repositories.event_repository import EventRepository
from api.system.models.models import Event as EventModel
from api.system.schemas.event import EditEvent as EditEventSchema
from api.system.schemas.event import Event as EventSchema
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

        if event.rrule is None:
            self.event_repository.edit(event, request)
            return EventSchema.model_validate(event)

        ghost_conditions = request.previous_date is not None and (
            request.previous_date != event.date
            or request.previous_start_time != event.start_time
            or request.previous_end_time != event.end_time
        )

        if ghost_conditions:
            exdate_entry = datetime.combine(
                request.previous_date or event.date,
                request.previous_start_time or event.start_time,
            ).strftime("%Y%m%dT%H%M%SZ")
            self.event_repository.add_exdate(event, exdate_entry)

            new_event = EventModel(
                title=request.title,
                description=request.description,
                location=request.location,
                date=request.date,
                start_time=request.start_time,
                end_time=request.end_time,
                colour=event.colour,
                user_id=event.user_id,
                user=event.user,
            )

            self.event_repository.add(new_event)
            return EventSchema.model_validate(new_event)

        self.event_repository.edit(event, request)
        return EventSchema.model_validate(event)
