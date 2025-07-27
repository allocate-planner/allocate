from typing import Annotated

from fastapi import APIRouter, Depends, File, UploadFile

from api.dependencies import get_current_user
from api.events.dependencies import (
    create_event_use_case,
    delete_event_use_case,
    edit_event_use_case,
    get_events_for_user_use_case,
    import_events_use_case,
)
from api.events.use_cases.create_event_use_case import CreateEventUseCase
from api.events.use_cases.delete_event_use_case import DeleteEventUseCase
from api.events.use_cases.edit_event_use_case import EditEventUseCase
from api.events.use_cases.get_events_for_user_use_case import GetEventsForUserUseCase
from api.events.use_cases.import_events_use_case import ImportEventsUseCase
from api.system.schemas import event

events = APIRouter()


@events.post("/api/v1/events", response_model=event.Event)
def create_event(
    request: event.EventBase,
    create_event_use_case: Annotated[
        CreateEventUseCase,
        Depends(create_event_use_case),
    ],
    current_user: Annotated[str, Depends(get_current_user)],
):
    return create_event_use_case.execute(request, current_user)


@events.get("/api/v1/events", response_model=event.EventList)
def get_events(
    get_events_for_user_use_case: Annotated[
        GetEventsForUserUseCase,
        Depends(get_events_for_user_use_case),
    ],
    current_user: Annotated[str, Depends(get_current_user)],
):
    return get_events_for_user_use_case.execute(current_user)


@events.delete("/api/v1/events/{event_id}", response_model=None)
def delete_event(
    event: event.DeleteEvent,
    delete_event_use_case: Annotated[
        DeleteEventUseCase,
        Depends(delete_event_use_case),
    ],
    current_user: Annotated[str, Depends(get_current_user)],
):
    delete_event_use_case.execute(event, current_user)
    return {"Message": "Event deleted successfully"}


@events.put("/api/v1/events/{event_id}", response_model=event.Event)
def edit_event(
    event_id: int,
    request: event.EditEvent,
    edit_event_use_case: Annotated[EditEventUseCase, Depends(edit_event_use_case)],
    current_user: Annotated[str, Depends(get_current_user)],
):
    return edit_event_use_case.execute(event_id, request, current_user)


@events.post("/api/v1/events/import", response_model=list[event.EventBase])
def import_events(
    file: Annotated[UploadFile, File()],
    import_events_use_case: Annotated[
        ImportEventsUseCase,
        Depends(import_events_use_case),
    ],
    create_event_use_case: Annotated[
        CreateEventUseCase,
        Depends(create_event_use_case),
    ],
    current_user: Annotated[str, Depends(get_current_user)],
):
    return import_events_use_case.execute(current_user, file, create_event_use_case)
