import io
import uuid
from io import BytesIO

from fastapi import UploadFile

from api.ai.services.transcription_service import TranscriptionService
from api.audio.errors.audio_transcription_error import AudioTranscriptionError
from api.system.interfaces.use_cases import UseCase
from api.system.schemas.audio import AudioTranscriptionResponse
from api.users.errors.user_not_found_error import UserNotFoundError
from api.users.repositories.user_repository import UserRepository

AUDIO_FILE_NAME: str = "_user_audio_file.mp3"


class TranscribeAudioUseCase(UseCase):
    def __init__(
        self,
        user_repository: UserRepository,
        transcription_service: TranscriptionService,
    ) -> None:
        self.user_repository = user_repository
        self.transcription_service = transcription_service

    async def execute(
        self,
        current_user: str,
        file: UploadFile,
    ) -> AudioTranscriptionResponse:
        user = self.user_repository.find_by_email(current_user)

        if user is None:
            msg = "User not found"
            raise UserNotFoundError(msg)

        session_id = TranscribeAudioUseCase.generate_session_id()

        try:
            buffer = self._parse_file_into_buffer(file)
            transcription = await self.transcription_service.transcribe_audio(
                buffer,
                session_id,
                current_user,
            )

            return AudioTranscriptionResponse(
                transcription=transcription,
                session_id=session_id,
            )
        except Exception as e:
            msg = "Error transcribing audio file"
            raise AudioTranscriptionError(msg) from e

    def _parse_file_into_buffer(self, file: UploadFile) -> BytesIO:
        file_content = file.file.read()

        buffer = io.BytesIO(file_content)
        buffer.name = AUDIO_FILE_NAME

        return buffer

    @staticmethod
    def generate_session_id() -> str:
        return str(uuid.uuid4())
