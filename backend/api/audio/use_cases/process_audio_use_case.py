import io
import json
import uuid
from datetime import datetime
from io import BytesIO

from fastapi import UploadFile

from api.ai.services.scheduling_service import SchedulingService
from api.ai.services.transcription_service import TranscriptionService
from api.audio.errors.audio_processing_error import AudioProcessingError
from api.events.use_cases.create_event_use_case import CreateEventUseCase
from api.events.use_cases.delete_event_use_case import DeleteEventUseCase
from api.events.use_cases.edit_event_use_case import EditEventUseCase
from api.system.interfaces.use_cases import UseCase
from api.system.schemas.event import DeleteEvent, EditEvent, EventBase
from api.users.errors.user_not_found_error import UserNotFoundError
from api.users.repositories.user_repository import UserRepository

MAX_PARTS: int = 3
AUDIO_FILE_NAME: str = "_user_audio_file.mp3"
TIME_FORMAT: str = "%H:%M"
SEPARATOR: str = "|"
MIN_PARTS_REQUIRED: int = 6
DESCRIPTION_INDEX: int = 6


class ProcessAudioUseCase(UseCase):
    def __init__(
        self,
        transcription_service: TranscriptionService,
        user_repository: UserRepository,
        scheduling_service: SchedulingService,
    ) -> None:
        self.transcription_service = transcription_service
        self.user_repository = user_repository
        self.scheduling_service = scheduling_service

    async def execute(  # noqa: PLR0913
        self,
        current_user: str,
        file: UploadFile,
        create_event_use_case: CreateEventUseCase,
        edit_event_use_case: EditEventUseCase,
        delete_event_use_case: DeleteEventUseCase,
        events: str | None = None,
    ) -> list[EventBase]:
        user = self.user_repository.find_by_email(current_user)

        if user is None:
            msg = "User not found"
            raise UserNotFoundError(msg)

        try:
            session_id = str(uuid.uuid4())

            buffer = self._parse_file_into_buffer(file)
            transcribed_audio = await self.transcription_service.transcribe_audio(
                buffer,
                session_id,
                current_user,
            )
            current_time = datetime.now().strftime(TIME_FORMAT)  # noqa: DTZ005

            parsed_events = self._parse_events_json(events)
            events_by_date = self._group_events_by_date(parsed_events)

            llm_response = await self.scheduling_service.get_scheduling_response(
                current_time,
                transcribed_audio,
                events_by_date,
                current_user,
                session_id,
            )

            return ProcessAudioUseCase._transform_llm_output_to_pydantic_objects(
                llm_response,
                create_event_use_case,
                edit_event_use_case,
                delete_event_use_case,
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

    def _parse_events_json(self, events_json: str | None) -> list[dict | None]:
        if not events_json:
            return []

        try:
            return json.loads(events_json)
        except json.JSONDecodeError:
            return []

    def _group_events_by_date(self, events: list[dict | None]) -> dict[str, list[dict]]:
        events_by_date: dict[str, list[dict]] = {}

        for event in events:
            if not event:
                continue

            event_date = event.get("date")
            if not event_date:
                continue

            if event_date not in events_by_date:
                events_by_date[event_date] = []

            events_by_date[event_date].append(
                {
                    "id": event.get("id"),
                    "title": event.get("title", ""),
                    "description": event.get("description", ""),
                    "start_time": event.get("start_time", ""),
                    "end_time": event.get("end_time", ""),
                }
            )

        return events_by_date

    @staticmethod
    def _transform_llm_output_to_pydantic_objects(
        response: str,
        create_event_use_case: CreateEventUseCase,
        edit_event_use_case: EditEventUseCase,
        delete_event_use_case: DeleteEventUseCase,
        current_user: str,
    ) -> list[EventBase]:
        events = []

        for line in response.split("\n"):
            if SEPARATOR not in line:
                continue

            parts = line.split(SEPARATOR)
            if len(parts) < MIN_PARTS_REQUIRED:
                continue

            action = parts[1]

            if action == "add":
                event = ProcessAudioUseCase._handle_add_action(
                    parts,
                    create_event_use_case,
                    current_user,
                )

                if event:
                    events.append(event)
            elif action == "edit":
                ProcessAudioUseCase._handle_edit_action(
                    parts,
                    edit_event_use_case,
                    current_user,
                )
            elif action == "delete":
                ProcessAudioUseCase._handle_delete_action(
                    parts,
                    delete_event_use_case,
                    current_user,
                )

        return events

    @staticmethod
    def _parse_llm_line(parts: list[str]) -> dict:
        return {
            "date": parts[0] if parts[0] else None,
            "event_id": parts[2] if parts[2] else None,
            "start_time": parts[3] if parts[3] else None,
            "end_time": parts[4] if parts[4] else None,
            "title": parts[5] if parts[5] else None,
            "description": (
                parts[DESCRIPTION_INDEX]
                if len(parts) > DESCRIPTION_INDEX and parts[DESCRIPTION_INDEX]
                else None
            ),
        }

    @staticmethod
    def _handle_add_action(
        parts: list[str],
        create_event_use_case: CreateEventUseCase,
        current_user: str,
    ) -> EventBase | None:
        parsed_inputs = ProcessAudioUseCase._parse_llm_line(parts)

        if (
            not parsed_inputs["date"]
            or not parsed_inputs["start_time"]
            or not parsed_inputs["end_time"]
            or not parsed_inputs["title"]
        ):
            return None

        target_date = datetime.strptime(parsed_inputs["date"], "%Y-%m-%d").date()  # noqa: DTZ007
        start_time_obj = datetime.strptime(  # noqa: DTZ007
            parsed_inputs["start_time"], TIME_FORMAT
        ).time()
        end_time_obj = datetime.strptime(  # noqa: DTZ007
            parsed_inputs["end_time"], TIME_FORMAT
        ).time()

        if start_time_obj.minute not in [0, 30] or end_time_obj.minute not in [0, 30]:
            return None

        event = EventBase(
            title=parsed_inputs["title"],
            description=parsed_inputs["description"],
            date=target_date,
            start_time=start_time_obj,
            end_time=end_time_obj,
            colour=CreateEventUseCase.random_background_colour(),
        )

        create_event_use_case.execute(event, current_user)
        return event

    @staticmethod
    def _handle_edit_action(
        parts: list[str],
        edit_event_use_case: EditEventUseCase,
        current_user: str,
    ) -> None:
        parsed_inputs = ProcessAudioUseCase._parse_llm_line(parts)

        if not parsed_inputs["event_id"]:
            return

        edit_date = (
            datetime.strptime(parsed_inputs["date"], "%Y-%m-%d").date()  # noqa: DTZ007
            if parsed_inputs["date"]
            else None
        )
        edit_start_time = (
            datetime.strptime(parsed_inputs["start_time"], TIME_FORMAT).time()  # noqa: DTZ007
            if parsed_inputs["start_time"]
            else None
        )
        edit_end_time = (
            datetime.strptime(parsed_inputs["end_time"], TIME_FORMAT).time()  # noqa: DTZ007
            if parsed_inputs["end_time"]
            else None
        )

        if edit_start_time and edit_start_time.minute not in [0, 30]:
            return

        if edit_end_time and edit_end_time.minute not in [0, 30]:
            return

        edit_request = EditEvent(
            title=parsed_inputs["title"],
            description=parsed_inputs["description"],
            date=edit_date,
            start_time=edit_start_time,
            end_time=edit_end_time,
        )

        edit_event_use_case.execute(
            int(parsed_inputs["event_id"]),
            edit_request,
            current_user,
        )

    @staticmethod
    def _handle_delete_action(
        parts: list[str],
        delete_event_use_case: DeleteEventUseCase,
        current_user: str,
    ) -> None:
        parsed_inputs = ProcessAudioUseCase._parse_llm_line(parts)

        if not parsed_inputs["event_id"]:
            return

        delete_event = DeleteEvent(event_id=int(parsed_inputs["event_id"]))
        delete_event_use_case.execute(delete_event, current_user)
