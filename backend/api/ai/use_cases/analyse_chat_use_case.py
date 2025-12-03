from datetime import UTC, datetime

from api.ai.errors.chat_analysis_error import ChatAnalysisError
from api.ai.services.chat_service import ChatService
from api.ai.utils.event_utils import group_events_by_date, parse_events
from api.system.interfaces.use_cases import UseCase
from api.system.schemas.chat import ChatInput, ChatOutput
from api.system.schemas.event import Event
from api.users.errors.user_not_found_error import UserNotFoundError
from api.users.repositories.user_repository import UserRepository

TIME_FORMAT: str = "%H:%M"


class AnalyseChatUseCase(UseCase):
    def __init__(
        self,
        user_repository: UserRepository,
        chat_service: ChatService,
    ) -> None:
        self.user_repository = user_repository
        self.chat_service = chat_service

    async def execute(
        self,
        current_user: str,
        chat: ChatInput,
        events: list[Event] | None = None,
    ) -> ChatOutput:
        user = self.user_repository.find_by_email(current_user)

        if user is None:
            msg = "User not found"
            raise UserNotFoundError(msg)

        try:
            current_time = datetime.now(tz=UTC).strftime(TIME_FORMAT)

            parsed_events = parse_events(events)
            events_by_date = group_events_by_date(parsed_events)

            response = await self.chat_service.get_chat_response(
                current_time,
                chat.user_input,
                events_by_date,
                current_user,
            )

            return ChatOutput(response=response)

        except ChatAnalysisError:
            raise
        except Exception as e:
            msg = "Error analysing chat"
            raise ChatAnalysisError(msg) from e
