import io
import json
from datetime import date, datetime
from io import BytesIO

from fastapi import UploadFile

from api.audio.errors.audio_processing_error import AudioProcessingError
from api.events.use_cases.create_event_use_case import CreateEventUseCase
from api.system.schemas.event import EventBase
from api.users.errors.user_not_found_error import UserNotFoundError
from api.users.repositories.user_repository import UserRepository
from api.utils.openapi_wrapper import OpenAIWrapper


class ProcessAudioUseCase:
    def __init__(
        self,
        openai_wrapper: OpenAIWrapper,
        user_repository: UserRepository,
    ) -> None:
        self.openai_wrapper = openai_wrapper
        self.user_repository = user_repository

    def execute(
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
            transcribed_audio = self.openai_wrapper.transcribe_audio(buffer)

            parsed_events = self._parse_events_json(events)

            llm_response = self.openai_wrapper.prompt_chat(
                datetime.now().strftime("%H:%M"),  # noqa: DTZ005
                transcribed_audio,
                parsed_events,
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
        buffer.name = "_user_audio_file.mp3"

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
            start_time, end_time, title = event.split("|")

            event = EventBase(  # noqa: PLW2901
                title=title,
                date=current_date,
                start_time=datetime.strptime(start_time, "%H:%M").time(),  # noqa: DTZ007
                end_time=datetime.strptime(end_time, "%H:%M").time(),  # noqa: DTZ007
                colour=CreateEventUseCase.random_background_colour(),
            )

            events.append(event)
            create_event_use_case.execute(event, current_user)

        return events
