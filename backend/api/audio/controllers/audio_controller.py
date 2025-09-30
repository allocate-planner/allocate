from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, UploadFile

from api.audio.dependencies import process_audio_use_case
from api.audio.use_cases.process_audio_use_case import ProcessAudioUseCase
from api.dependencies import get_current_user
from api.events.dependencies import (
    create_event_use_case,
    delete_event_use_case,
    edit_event_use_case,
)
from api.events.use_cases.create_event_use_case import CreateEventUseCase
from api.events.use_cases.delete_event_use_case import DeleteEventUseCase
from api.events.use_cases.edit_event_use_case import EditEventUseCase
from api.system.schemas.event import EventBase

audio = APIRouter()


@audio.post("/api/v1/audio", response_model=list[EventBase])
async def process_audio(  # noqa: PLR0913
    file: Annotated[UploadFile, File()],
    events: Annotated[str, Form()],
    process_audio_use_case: Annotated[
        ProcessAudioUseCase,
        Depends(process_audio_use_case),
    ],
    create_event_use_case: Annotated[
        CreateEventUseCase,
        Depends(create_event_use_case),
    ],
    edit_event_use_case: Annotated[
        EditEventUseCase,
        Depends(edit_event_use_case),
    ],
    delete_event_use_case: Annotated[
        DeleteEventUseCase,
        Depends(delete_event_use_case),
    ],
    current_user: Annotated[str, Depends(get_current_user)],
):
    return await process_audio_use_case.execute(
        current_user,
        file,
        create_event_use_case,
        edit_event_use_case,
        delete_event_use_case,
        events,
    )
