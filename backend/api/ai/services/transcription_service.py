import os
from io import BytesIO

from langfuse import get_client, observe
from openai import AsyncOpenAI

from api.ai.services.prompt_service import PromptService

BASE_PROMPT_PATH: str = "base.prompt"
TRANSCRIPTION_MODEL: str = "whisper-large-v3"

BASE_URL = "https://api.groq.com/openai/v1"
API_KEY = os.environ.get("ALLOCATE_GROQ_API_KEY")


class TranscriptionService:
    def __init__(self) -> None:
        self.client = AsyncOpenAI(
            base_url=BASE_URL,
            api_key=API_KEY,
        )
        self.prompt_service = PromptService(BASE_PROMPT_PATH)

    @observe()
    async def transcribe_audio(
        self,
        buffer: BytesIO,
        session_id: str | None = None,
        current_user: str | None = None,
    ) -> str:
        if session_id:
            langfuse = get_client()
            langfuse.update_current_trace(session_id=session_id)
            langfuse.update_current_trace(user_id=current_user)

        transcription = await self.client.audio.transcriptions.create(
            model=TRANSCRIPTION_MODEL,
            file=buffer,
        )

        return transcription.text

    def get_scheduling_prompt(
        self,
        current_time: str,
        events_by_date: dict[str, list[dict]],
    ) -> str:
        return self.prompt_service.get_prompt(current_time, events_by_date)
