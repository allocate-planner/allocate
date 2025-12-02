from typing import Annotated

from fastapi import Depends

from api.ai.connectors.exa_connector import ExaConnector
from api.ai.services.scheduling_service import SchedulingService
from api.ai.services.search_service import SearchService
from api.ai.services.tools_service import ToolsService
from api.ai.services.transcription_service import TranscriptionService
from api.ai.use_cases.analyse_audio_use_case import AnalyseAudioUseCase
from api.ai.use_cases.apply_recommendations_use_case import (
    ApplyRecommendationsUseCase,
)
from api.ai.use_cases.transcribe_audio_use_case import TranscribeAudioUseCase
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


def transcribe_audio_use_case(
    user_repository: Annotated[UserRepository, Depends(get_user_repository)],
    transcription_service: Annotated[
        TranscriptionService,
        Depends(transcription_service),
    ],
) -> TranscribeAudioUseCase:
    return TranscribeAudioUseCase(
        user_repository,
        transcription_service,
    )


def analyse_audio_use_case(
    user_repository: Annotated[UserRepository, Depends(get_user_repository)],
    scheduling_service: Annotated[
        SchedulingService,
        Depends(scheduling_service),
    ],
) -> AnalyseAudioUseCase:
    return AnalyseAudioUseCase(
        user_repository,
        scheduling_service,
    )


def apply_recommendations_use_case(
    user_repository: Annotated[UserRepository, Depends(get_user_repository)],
) -> ApplyRecommendationsUseCase:
    return ApplyRecommendationsUseCase(
        user_repository,
    )
