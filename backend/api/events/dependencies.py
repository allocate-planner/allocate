from fastapi import Depends

from api.dependencies import EventRepository
from api.dependencies import UserRepository

from api.events.use_cases.create_event_use_case import CreateEventUseCase
from api.events.use_cases.get_events_for_user_use_case import GetEventsForUserUseCase
from api.events.use_cases.delete_event_use_case import DeleteEventUseCase
from api.events.use_cases.edit_event_use_case import EditEventUseCase
from api.events.use_cases.import_events_use_case import ImportEventsUseCase

from api.dependencies import get_event_repository
from api.dependencies import get_user_repository


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


def delete_event_use_case(
    event_repository: EventRepository = Depends(get_event_repository),
    user_repository: UserRepository = Depends(get_user_repository),
) -> DeleteEventUseCase:
    return DeleteEventUseCase(event_repository, user_repository)


def edit_event_use_case(
    event_repository: EventRepository = Depends(get_event_repository),
    user_repository: UserRepository = Depends(get_user_repository),
) -> EditEventUseCase:
    return EditEventUseCase(event_repository, user_repository)


def import_events_use_case(
    event_repository: EventRepository = Depends(get_event_repository),
    user_repository: UserRepository = Depends(get_user_repository),
) -> ImportEventsUseCase:
    return ImportEventsUseCase(event_repository, user_repository)
