from typing import Annotated

from fastapi import Depends

from api.audio.use_cases.process_audio_use_case import ProcessAudioUseCase
from api.dependencies import UserRepository, get_user_repository
from api.infrastructure.ai.scheduling_service import SchedulingService
from api.infrastructure.ai.tools_service import ToolsService
from api.infrastructure.ai.transcription_service import TranscriptionService
from api.integrations.dependencies import search_notion_use_case
from api.integrations.use_cases.search_notion_use_case import SearchNotionUseCase


def transcription_service() -> TranscriptionService:
    return TranscriptionService()


def tools_service(
    search_notion_use_case: Annotated[
        SearchNotionUseCase,
        Depends(search_notion_use_case),
    ],
) -> ToolsService:
    return ToolsService(search_notion_use_case)


def scheduling_service(
    transcription_service: Annotated[
        TranscriptionService,
        Depends(transcription_service),
    ],
    tools_service: Annotated[ToolsService, Depends(tools_service)],
) -> SchedulingService:
    return SchedulingService(transcription_service, tools_service)


def process_audio_use_case(
    transcription_service: Annotated[
        TranscriptionService,
        Depends(transcription_service),
    ],
    user_repository: Annotated[UserRepository, Depends(get_user_repository)],
    scheduling_service: Annotated[SchedulingService, Depends(scheduling_service)],
) -> ProcessAudioUseCase:
    return ProcessAudioUseCase(
        transcription_service,
        user_repository,
        scheduling_service,
    )
