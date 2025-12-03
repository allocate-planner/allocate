from datetime import datetime

from api.ai.errors.audio_analysis_error import AudioAnalysisError
from api.ai.services.scheduling_service import SchedulingService
from api.ai.utils.event_utils import group_events_by_date, parse_events
from api.system.interfaces.use_cases import UseCase
from api.system.schemas.audio import AudioAnalysisOutput
from api.system.schemas.event import Event
from api.users.errors.user_not_found_error import UserNotFoundError
from api.users.repositories.user_repository import UserRepository

TIME_FORMAT: str = "%H:%M"
SEPARATOR: str = "|"
BASE_ERROR_MESSAGE = "LLM output is invalid"


class AnalyseAudioUseCase(UseCase):
    def __init__(
        self,
        user_repository: UserRepository,
        scheduling_service: SchedulingService,
    ) -> None:
        self.user_repository = user_repository
        self.scheduling_service = scheduling_service

    async def execute(
        self,
        current_user: str,
        transcription_response: str,
        session_id: str,
        events: list[Event] | None = None,
    ) -> AudioAnalysisOutput:
        user = self.user_repository.find_by_email(current_user)

        if user is None:
            msg = "User not found"
            raise UserNotFoundError(msg)

        try:
            current_time = datetime.now().strftime(TIME_FORMAT)  # noqa: DTZ005
            parsed_events = parse_events(events)
            events_by_date = group_events_by_date(parsed_events)

            llm_output = await self.scheduling_service.get_scheduling_response(
                current_time,
                transcription_response,
                events_by_date,
                current_user,
                session_id,
            )

            return self._validate_and_return_response(
                llm_output,
                session_id,
            )

        except AudioAnalysisError:
            raise
        except Exception as e:
            msg = "Error analysing audio"
            raise AudioAnalysisError(msg) from e

    def _validate_and_return_response(
        self,
        llm_output: str,
        session_id: str,
    ) -> AudioAnalysisOutput:
        if SEPARATOR not in llm_output:
            raise AudioAnalysisError(BASE_ERROR_MESSAGE)

        return AudioAnalysisOutput(
            llm_output=llm_output,
            session_id=session_id,
        )
