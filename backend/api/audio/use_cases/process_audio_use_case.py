import io
from io import BytesIO

from fastapi import UploadFile

from api.openai.openapi_wrapper import OpenAIWrapper

from api.audio.errors.audio_processing_error import AudioProcessingError


class ProcessAudioUseCase:
    def __init__(self, openai_wrapper: OpenAIWrapper) -> None:
        self.openai_wrapper = openai_wrapper

    def execute(self, file: UploadFile) -> str:
        try:
            buffer = self._parse_file_into_buffer(file)
            return self.openai_wrapper.transcribe_audio(buffer)
        except Exception as e:
            raise AudioProcessingError(f"Error processing audio file: {str(e)}")

    def _parse_file_into_buffer(self, file: UploadFile) -> BytesIO:
        file_content = file.file.read()

        buffer = io.BytesIO(file_content)
        buffer.name = "_user_audio_file.mp3"

        return buffer
