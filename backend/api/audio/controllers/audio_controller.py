from typing import Annotated

from fastapi import APIRouter, Depends, File, UploadFile

from api.audio.dependencies import (
    analyse_audio_use_case,
    apply_recommendations_use_case,
    transcribe_audio_use_case,
)
from api.audio.use_cases.analyse_audio_use_case import AnalyseAudioUseCase
from api.audio.use_cases.apply_recommendations_use_case import (
    ApplyRecommendationsUseCase,
)
from api.audio.use_cases.transcribe_audio_use_case import TranscribeAudioUseCase
from api.dependencies import get_current_user
from api.events.dependencies import (
    create_event_use_case,
    delete_event_use_case,
    edit_event_use_case,
)
from api.events.use_cases.create_event_use_case import CreateEventUseCase
from api.events.use_cases.delete_event_use_case import DeleteEventUseCase
from api.events.use_cases.edit_event_use_case import EditEventUseCase
from api.system.schemas.audio import AudioAnalysisOutput, AudioTranscriptionResponse
from api.system.schemas.event import Event, EventBase

audio = APIRouter()


@audio.post("/api/v1/audio/transcribe", response_model=AudioTranscriptionResponse)
async def transcribe_audio(
    file: Annotated[UploadFile, File()],
    transcribe_audio_use_case: Annotated[
        TranscribeAudioUseCase,
        Depends(transcribe_audio_use_case),
    ],
    current_user: Annotated[str, Depends(get_current_user)],
):
    return await transcribe_audio_use_case.execute(
        current_user,
        file,
    )


@audio.post("/api/v1/audio/analyse", response_model=AudioAnalysisOutput)
async def analyse_audio(
    transcription_response: AudioTranscriptionResponse,
    events: list[Event],
    analyse_audio_use_case: Annotated[
        AnalyseAudioUseCase,
        Depends(analyse_audio_use_case),
    ],
    current_user: Annotated[str, Depends(get_current_user)],
):
    return await analyse_audio_use_case.execute(
        current_user,
        transcription_response.transcription,
        transcription_response.session_id,
        events,
    )


@audio.post("/api/v1/audio/apply", response_model=list[EventBase])
def apply_recommendations(  # noqa: PLR0913
    analysis_output: AudioAnalysisOutput,
    apply_recommendations_use_case: Annotated[
        ApplyRecommendationsUseCase,
        Depends(apply_recommendations_use_case),
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
    return apply_recommendations_use_case.execute(
        current_user,
        analysis_output.llm_output,
        create_event_use_case,
        edit_event_use_case,
        delete_event_use_case,
    )
