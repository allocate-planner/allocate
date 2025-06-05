import random
from typing import Any

from api.events.repositories.event_repository import EventRepository
from api.system.models.models import Event
from api.system.schemas.schemas import Event as EventSchema
from api.system.schemas.schemas import EventBase
from api.users.errors.user_not_found import UserNotFound
from api.users.repositories.user_repository import UserRepository


class CreateEventUseCase:
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
            raise UserNotFound(msg)

        event_data: dict[str, Any] = {
            "title": request.title,
            "date": request.date,
            "start_time": request.start_time,
            "end_time": request.end_time,
            "colour": request.colour
            if request.colour
            else CreateEventUseCase.random_background_colour(),
            "user_id": user.id,
            "user": user,
        }

        if request.description is not None:
            event_data["description"] = request.description

        if request.location is not None:
            event_data["location"] = request.location

        event = Event(**event_data)

        self.event_repository.add(event)

        return EventSchema.model_validate(event)

    @staticmethod
    def random_background_colour() -> str:
        bg_colours: list[str] = [
            "#FD8A8A",
            "#FFCBCB",
            "#9EA1D4",
            "#F1F7B5",
            "#A8D1D1",
            "#DFEBEB",
        ]
        return random.choice(bg_colours)  # noqa: S311
