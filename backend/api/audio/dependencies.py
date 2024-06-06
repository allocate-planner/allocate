from fastapi import Depends

from api.audio.use_cases.process_audio_use_case import ProcessAudioUseCase

from api.openai.openapi_wrapper import OpenAIWrapper


def openapi_wrapper() -> OpenAIWrapper:
    return OpenAIWrapper()


def process_audio_use_case(
    openai_wrapper: OpenAIWrapper = Depends(openapi_wrapper),
) -> ProcessAudioUseCase:
    return ProcessAudioUseCase(openai_wrapper)
