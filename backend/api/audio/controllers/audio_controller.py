from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile

from api.audio.dependencies import process_audio_use_case
from api.audio.errors.audio_processing_error import AudioProcessingError
from api.audio.use_cases.process_audio_use_case import ProcessAudioUseCase
from api.dependencies import get_current_user
from api.events.dependencies import create_event_use_case
from api.events.use_cases.create_event_use_case import CreateEventUseCase
from api.system.schemas.event import EventBase

audio = APIRouter()


@audio.post("/api/v1/audio", response_model=list[EventBase])
async def process_audio(
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
    current_user: Annotated[str, Depends(get_current_user)],
):
    try:
        return await process_audio_use_case.execute(
            current_user,
            file,
            create_event_use_case,
            events,
        )
    except AudioProcessingError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error") from e
