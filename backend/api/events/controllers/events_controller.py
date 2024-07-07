from typing import List

from fastapi import Depends, APIRouter, HTTPException, UploadFile, File

from api.system.schemas import schemas

from api.events.use_cases.create_event_use_case import CreateEventUseCase
from api.events.use_cases.get_events_for_user_use_case import GetEventsForUserUseCase
from api.events.use_cases.delete_event_use_case import DeleteEventUseCase
from api.events.use_cases.edit_event_use_case import EditEventUseCase
from api.events.use_cases.import_events_use_case import ImportEventsUseCase

from api.events.dependencies import create_event_use_case
from api.events.dependencies import get_events_for_user_use_case
from api.events.dependencies import delete_event_use_case
from api.events.dependencies import edit_event_use_case
from api.events.dependencies import import_events_use_case

from api.dependencies import get_current_user

from api.users.errors.user_not_found import UserNotFound
from api.events.errors.event_not_found import EventNotFound
from api.events.errors.events_not_found import EventsNotFound


events = APIRouter()


@events.post("/api/v1/events", response_model=schemas.Event)
def create_event(
    request: schemas.EventBase,
    create_event_use_case: CreateEventUseCase = Depends(create_event_use_case),
    current_user: str = Depends(get_current_user),
):
    try:
        return create_event_use_case.execute(request, current_user)
    except UserNotFound as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@events.get("/api/v1/events", response_model=schemas.EventList)
def get_events(
    request: schemas.GetEvent = Depends(),
    get_events_for_user_use_case: GetEventsForUserUseCase = Depends(
        get_events_for_user_use_case
    ),
    current_user: str = Depends(get_current_user),
):
    try:
        return get_events_for_user_use_case.execute(current_user, request)
    except UserNotFound as e:
        raise HTTPException(status_code=404, detail=str(e))
    except EventsNotFound as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@events.delete("/api/v1/events/{event_id}", response_model=None)
def delete_event(
    event_id: int,
    delete_event_use_case: DeleteEventUseCase = Depends(delete_event_use_case),
    current_user: str = Depends(get_current_user),
):
    try:
        delete_event_use_case.execute(event_id, current_user)

        return {"Message": "Event deleted successfully"}
    except UserNotFound as e:
        raise HTTPException(status_code=404, detail=str(e))
    except EventNotFound as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@events.put("/api/v1/events/{event_id}", response_model=schemas.Event)
def edit_event(
    event_id: int,
    request: schemas.EventBase,
    edit_event_use_case: EditEventUseCase = Depends(edit_event_use_case),
    current_user: str = Depends(get_current_user),
):
    try:
        return edit_event_use_case.execute(event_id, request, current_user)
    except UserNotFound as e:
        raise HTTPException(status_code=404, detail=str(e))
    except EventNotFound as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@events.post("/api/v1/events/import", response_model=List[schemas.EventBase])
def import_events(
    file: UploadFile = File(...),
    import_events_use_case: ImportEventsUseCase = Depends(import_events_use_case),
    create_event_use_case: CreateEventUseCase = Depends(create_event_use_case),
    current_user: str = Depends(get_current_user),
):
    try:
        return import_events_use_case.execute(current_user, file, create_event_use_case)
    except UserNotFound as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
