from typing import Annotated

from fastapi import Depends

from api.audio.use_cases.process_audio_use_case import ProcessAudioUseCase
from api.dependencies import UserRepository, get_user_repository
from api.openai.openapi_wrapper import OpenAIWrapper


def openapi_wrapper() -> OpenAIWrapper:
    return OpenAIWrapper()


def process_audio_use_case(
    openai_wrapper: Annotated[OpenAIWrapper, Depends(openapi_wrapper)],
    user_repository: Annotated[UserRepository, Depends(get_user_repository)],
) -> ProcessAudioUseCase:
    return ProcessAudioUseCase(openai_wrapper, user_repository)
