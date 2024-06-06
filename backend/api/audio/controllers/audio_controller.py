from fastapi import APIRouter, Depends, HTTPException, UploadFile, File

from api.audio.use_cases.process_audio_use_case import ProcessAudioUseCase

from api.audio.dependencies import process_audio_use_case

from api.audio.errors.audio_processing_error import AudioProcessingError


audio = APIRouter()


@audio.post("/api/v1/audio")
def process_audio(
    file: UploadFile = File(...),
    process_audio_use_case: ProcessAudioUseCase = Depends(process_audio_use_case),
):
    try:
        return process_audio_use_case.execute(file)
    except AudioProcessingError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Internal Server Error")
