from typing import Annotated

from fastapi import Depends

from api.ai.connectors.exa_connector import ExaConnector
from api.ai.services.scheduling_service import SchedulingService
from api.ai.services.search_service import SearchService
from api.ai.services.tools_service import ToolsService
from api.ai.services.transcription_service import TranscriptionService
from api.audio.use_cases.process_audio_use_case import ProcessAudioUseCase
from api.dependencies import UserRepository, get_user_repository
from api.integrations.dependencies import search_integration_use_case
from api.integrations.use_cases.search_integration_use_case import (
    SearchIntegrationUseCase,
)


def transcription_service() -> TranscriptionService:
    return TranscriptionService()


def exa_connector() -> ExaConnector:
    return ExaConnector()


def search_service(
    exa_connector: Annotated[ExaConnector, Depends(exa_connector)],
) -> SearchService:
    return SearchService(exa_connector)


def tools_service(
    search_integration_use_case: Annotated[
        SearchIntegrationUseCase,
        Depends(search_integration_use_case),
    ],
    search_service: Annotated[SearchService, Depends(search_service)],
) -> ToolsService:
    return ToolsService(search_integration_use_case, search_service)


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
