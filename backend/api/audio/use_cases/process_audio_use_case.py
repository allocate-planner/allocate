import io
import random

from io import BytesIO
from typing import List
from datetime import date, datetime

from fastapi import UploadFile

from api.openai.openapi_wrapper import OpenAIWrapper

from api.users.repositories.user_repository import UserRepository

from api.events.use_cases.create_event_use_case import CreateEventUseCase

from api.system.schemas.schemas import EventBase

from api.audio.errors.audio_processing_error import AudioProcessingError
from api.users.errors.user_not_found import UserNotFound


class ProcessAudioUseCase:
    def __init__(
        self, openai_wrapper: OpenAIWrapper, user_repository: UserRepository
    ) -> None:
        self.openai_wrapper = openai_wrapper
        self.user_repository = user_repository

    def execute(
        self,
        current_user: str,
        file: UploadFile,
        create_event_use_case: CreateEventUseCase,
    ) -> List[EventBase]:
        user = self.user_repository.find_by_email(current_user)

        if user is None:
            raise UserNotFound("User not found")

        try:
            buffer = self._parse_file_into_buffer(file)
            transcribed_audio = self.openai_wrapper.transcribe_audio(buffer)

            llm_response = self.openai_wrapper.prompt_chat(transcribed_audio)

            return ProcessAudioUseCase._transform_llm_output_to_pydantic_objects(
                llm_response, create_event_use_case, current_user
            )
        except Exception as e:
            raise AudioProcessingError(f"Error processing audio file: {str(e)}")

    def _parse_file_into_buffer(self, file: UploadFile) -> BytesIO:
        file_content = file.file.read()

        buffer = io.BytesIO(file_content)
        buffer.name = "_user_audio_file.mp3"

        return buffer

    @staticmethod
    def _transform_llm_output_to_pydantic_objects(
        response: str, create_event_use_case: CreateEventUseCase, current_user: str
    ) -> List[EventBase]:
        events: List = []
        current_date = date.today()

        for event in response.split("\n"):
            start_time, end_time, title = event.split("|")

            event = EventBase(
                title=title,
                date=current_date,
                start_time=datetime.strptime(start_time, "%H:%M").time(),
                end_time=datetime.strptime(end_time, "%H:%M").time(),
                colour=ProcessAudioUseCase._random_background_colour(),
            )

            events.append(event)
            create_event_use_case.execute(event, current_user)

        return events

    @staticmethod
    def _random_background_colour() -> str:
        bg_colours: List[str] = [
            "#FD8A8A",
            "#FFCBCB",
            "#9EA1D4",
            "#F1F7B5",
            "#A8D1D1",
            "#DFEBEB",
        ]
        return random.choice(bg_colours)
