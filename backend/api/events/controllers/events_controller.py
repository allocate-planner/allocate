from fastapi import Depends, APIRouter, HTTPException

from api.system.schemas import schemas

from api.events.use_cases.create_event_use_case import CreateEventUseCase
from api.events.use_cases.get_events_for_user_use_case import GetEventsForUserUseCase

from api.events.dependencies import create_event_use_case
from api.events.dependencies import get_events_for_user_use_case

from api.middleware.dependencies import get_current_user


events = APIRouter()


@events.post("/api/v1/events", response_model=schemas.Event)
def create_event(
    request: schemas.EventBase,
    create_event_use_case: CreateEventUseCase = Depends(create_event_use_case),
    current_user: str = Depends(get_current_user),
):
    try:
        return create_event_use_case.execute(request, current_user)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@events.get("/api/v1/events", response_model=schemas.EventList)
def get_events(
    get_events_for_user_use_case: GetEventsForUserUseCase = Depends(
        get_events_for_user_use_case
    ),
    current_user: str = Depends(get_current_user),
):
    try:
        return get_events_for_user_use_case.execute(current_user)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
