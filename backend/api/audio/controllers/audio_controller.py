from typing import List

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File

from api.system.schemas import schemas

from api.audio.use_cases.process_audio_use_case import ProcessAudioUseCase
from api.events.use_cases.create_event_use_case import CreateEventUseCase

from api.audio.dependencies import process_audio_use_case
from api.events.dependencies import create_event_use_case

from api.audio.errors.audio_processing_error import AudioProcessingError

from api.dependencies import get_current_user


audio = APIRouter()


@audio.post("/api/v1/audio", response_model=List[schemas.EventBase])
def process_audio(
    file: UploadFile = File(...),
    process_audio_use_case: ProcessAudioUseCase = Depends(process_audio_use_case),
    create_event_use_case: CreateEventUseCase = Depends(create_event_use_case),
    current_user: str = Depends(get_current_user),
):
    try:
        return process_audio_use_case.execute(current_user, file, create_event_use_case)
    except AudioProcessingError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Internal Server Error")
