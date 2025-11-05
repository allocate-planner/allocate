from datetime import datetime

from api.audio.errors.audio_transformation_error import AudioTransformationError
from api.events.use_cases.create_event_use_case import CreateEventUseCase
from api.events.use_cases.delete_event_use_case import DeleteEventUseCase
from api.events.use_cases.edit_event_use_case import EditEventUseCase
from api.system.interfaces.use_cases import UseCase
from api.system.schemas.event import DeleteEvent, EditEvent, EventBase
from api.users.errors.user_not_found_error import UserNotFoundError
from api.users.repositories.user_repository import UserRepository

MAX_PARTS: int = 3
TIME_FORMAT: str = "%H:%M"
SEPARATOR: str = "|"
MIN_PARTS_REQUIRED: int = 6
DESCRIPTION_INDEX: int = 6


class ApplyRecommendationsUseCase(UseCase):
    def __init__(
        self,
        user_repository: UserRepository,
    ) -> None:
        self.user_repository = user_repository

    async def execute(
        self,
        current_user: str,
        recommendations: str,
        create_event_use_case: CreateEventUseCase,
        edit_event_use_case: EditEventUseCase,
        delete_event_use_case: DeleteEventUseCase,
    ) -> list[EventBase]:
        user = self.user_repository.find_by_email(current_user)

        if user is None:
            msg = "User not found"
            raise UserNotFoundError(msg)

        try:
            return (
                ApplyRecommendationsUseCase._transform_llm_output_to_pydantic_objects(
                    recommendations,
                    create_event_use_case,
                    edit_event_use_case,
                    delete_event_use_case,
                    current_user,
                )
            )
        except Exception as e:
            msg = f"Error transforming LLM output into Pydantic objects: {e!s}"
            raise AudioTransformationError(msg) from e

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
                event = ApplyRecommendationsUseCase._handle_add_action(
                    parts,
                    create_event_use_case,
                    current_user,
                )

                if event:
                    events.append(event)
            elif action == "edit":
                ApplyRecommendationsUseCase._handle_edit_action(
                    parts,
                    edit_event_use_case,
                    current_user,
                )
            elif action == "delete":
                ApplyRecommendationsUseCase._handle_delete_action(
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
        parsed_inputs = ApplyRecommendationsUseCase._parse_llm_line(parts)

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
        parsed_inputs = ApplyRecommendationsUseCase._parse_llm_line(parts)

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
        parsed_inputs = ApplyRecommendationsUseCase._parse_llm_line(parts)

        if not parsed_inputs["event_id"]:
            return

        delete_event = DeleteEvent(event_id=int(parsed_inputs["event_id"]))
        delete_event_use_case.execute(delete_event, current_user)
