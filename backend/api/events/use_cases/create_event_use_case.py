import random
from typing import Any

from api.events.repositories.event_repository import EventRepository
from api.system.interfaces.use_cases import UseCase
from api.system.models.models import Event
from api.system.schemas.event import Event as EventSchema
from api.system.schemas.event import EventBase
from api.users.errors.user_not_found_error import UserNotFoundError
from api.users.repositories.user_repository import UserRepository


class CreateEventUseCase(UseCase):
    def __init__(
        self,
        event_repository: EventRepository,
        user_repository: UserRepository,
    ) -> None:
        self.event_repository = event_repository
        self.user_repository = user_repository

    def execute(
        self,
        request: EventBase,
        current_user: str,
    ) -> EventSchema:
        user = self.user_repository.find_by_email(current_user)

        if user is None:
            msg = "User not found"
            raise UserNotFoundError(msg)

        event_data: dict[str, Any] = {
            "title": request.title,
            "date": request.date,
            "start_time": request.start_time,
            "end_time": request.end_time,
            "colour": request.colour if request.colour else "#8D85D2",
            "user_id": user.id,
            "user": user,
        }

        if request.description is not None:
            event_data["description"] = request.description
        if request.location is not None:
            event_data["location"] = request.location
        if request.rrule is not None:
            event_data["rrule"] = request.rrule
        if request.exdate is not None:
            event_data["exdate"] = request.exdate

        event = Event(**event_data)

        self.event_repository.add(event)

        return EventSchema.model_validate(event)

    @staticmethod
    def random_background_colour() -> str:
        bg_colours: list[str] = [
            "#8D85D2",
            "#86B89A",
            "#A9C7EA",
            "#F7CEB7",
            "#E09BA7",
            "#C3CEDC",
        ]
        return random.choice(bg_colours)  # noqa: S311
