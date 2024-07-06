from fastapi import Depends

from api.dependencies import UserRepository

from api.audio.use_cases.process_audio_use_case import ProcessAudioUseCase

from api.openai.openapi_wrapper import OpenAIWrapper

from api.dependencies import get_user_repository


def openapi_wrapper() -> OpenAIWrapper:
    return OpenAIWrapper()


def process_audio_use_case(
    openai_wrapper: OpenAIWrapper = Depends(openapi_wrapper),
    user_repository: UserRepository = Depends(get_user_repository),
) -> ProcessAudioUseCase:
    return ProcessAudioUseCase(openai_wrapper, user_repository)
