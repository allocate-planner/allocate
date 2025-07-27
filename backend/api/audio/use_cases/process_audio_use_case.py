import io
import json
from datetime import date, datetime
from io import BytesIO

from fastapi import UploadFile

from api.audio.errors.audio_processing_error import AudioProcessingError
from api.events.use_cases.create_event_use_case import CreateEventUseCase
from api.infrastructure.ai.scheduling_service import SchedulingService
from api.infrastructure.ai.transcription_service import TranscriptionService
from api.system.schemas.event import EventBase
from api.users.errors.user_not_found_error import UserNotFoundError
from api.users.repositories.user_repository import UserRepository

MAX_PARTS: int = 3
AUDIO_FILE_NAME: str = "_user_audio_file.mp3"
TIME_FORMAT: str = "%H:%M"
SEPARATOR: str = "|"
MIN_PARTS_REQUIRED: int = 3


class ProcessAudioUseCase:
    def __init__(
        self,
        transcription_service: TranscriptionService,
        user_repository: UserRepository,
        scheduling_service: SchedulingService,
    ) -> None:
        self.transcription_service = transcription_service
        self.user_repository = user_repository
        self.scheduling_service = scheduling_service

    async def execute(
        self,
        current_user: str,
        file: UploadFile,
        create_event_use_case: CreateEventUseCase,
        events: str | None = None,
    ) -> list[EventBase]:
        user = self.user_repository.find_by_email(current_user)

        if user is None:
            msg = "User not found"
            raise UserNotFoundError(msg)

        try:
            buffer = self._parse_file_into_buffer(file)
            transcribed_audio = self.transcription_service.transcribe_audio(buffer)
            current_time = datetime.now().strftime(TIME_FORMAT)  # noqa: DTZ005

            parsed_events = self._parse_events_json(events)

            llm_response = await self.scheduling_service.get_scheduling_response(
                current_time,
                transcribed_audio,
                parsed_events,
                current_user,
            )

            return ProcessAudioUseCase._transform_llm_output_to_pydantic_objects(
                llm_response,
                create_event_use_case,
                current_user,
            )
        except Exception as e:
            msg = f"Error processing audio file: {e!s}"
            raise AudioProcessingError(msg) from e

    def _parse_file_into_buffer(self, file: UploadFile) -> BytesIO:
        file_content = file.file.read()

        buffer = io.BytesIO(file_content)
        buffer.name = AUDIO_FILE_NAME

        return buffer

    def _parse_events_json(self, events_json: str | None) -> list[dict]:
        if not events_json:
            return []

        try:
            return json.loads(events_json)
        except json.JSONDecodeError:
            return []

    @staticmethod
    def _transform_llm_output_to_pydantic_objects(
        response: str,
        create_event_use_case: CreateEventUseCase,
        current_user: str,
    ) -> list[EventBase]:
        events = []
        current_date = date.today()  # noqa: DTZ011

        for event in response.split("\n"):
            if SEPARATOR not in event:
                continue

            parts = event.split(SEPARATOR)
            if len(parts) < MIN_PARTS_REQUIRED:
                continue

            start_time, end_time, title = parts[0], parts[1], parts[2]
            description = parts[3] if len(parts) > MAX_PARTS else None

            event = EventBase(  # noqa: PLW2901
                title=title,
                description=description,
                date=current_date,
                start_time=datetime.strptime(start_time, TIME_FORMAT).time(),  # noqa: DTZ007
                end_time=datetime.strptime(end_time, TIME_FORMAT).time(),  # noqa: DTZ007
                colour=CreateEventUseCase.random_background_colour(),
            )

            events.append(event)
            create_event_use_case.execute(event, current_user)

        return events
