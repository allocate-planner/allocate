from fastapi import Depends

from api.middleware.dependencies import EventRepository
from api.middleware.dependencies import UserRepository

from api.events.use_cases.create_event_use_case import CreateEventUseCase
from api.events.use_cases.get_events_for_user_use_case import GetEventsForUserUseCase

from api.middleware.dependencies import get_event_repository
from api.middleware.dependencies import get_user_repository


def create_event_use_case(
    event_repository: EventRepository = Depends(get_event_repository),
    user_repository: UserRepository = Depends(get_user_repository),
) -> CreateEventUseCase:
    return CreateEventUseCase(event_repository, user_repository)


def get_events_for_user_use_case(
    event_repository: EventRepository = Depends(get_event_repository),
    user_repository: UserRepository = Depends(get_user_repository),
) -> GetEventsForUserUseCase:
    return GetEventsForUserUseCase(event_repository, user_repository)
