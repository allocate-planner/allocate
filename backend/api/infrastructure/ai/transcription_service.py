import os
from datetime import UTC, datetime
from io import BytesIO

from openai import OpenAI

BASE_PROMPT_PATH: str = "base.prompt"
TRANSCRIPTION_MODEL: str = "whisper-large-v3"
FILE_ENCODING: str = "utf8"

PLACEHOLDER_EVENTS: str = "{events}"
PLACEHOLDER_TIME: str = "{time}"
PLACEHOLDER_DAY: str = "{day}"

NO_EVENTS_TEXT: str = "No events scheduled"
NO_TITLE_TEXT: str = "(no title)"

BASE_URL = "https://api.groq.com/openai/v1"
API_KEY = os.environ.get("ALLOCATE_GROQ_API_KEY")


class TranscriptionService:
    def __init__(self) -> None:
        self.client = OpenAI(
            base_url=BASE_URL,
            api_key=API_KEY,
        )
        self.prompt = ""

    def transcribe_audio(self, buffer: BytesIO) -> str:
        transcription = self.client.audio.transcriptions.create(
            model=TRANSCRIPTION_MODEL,
            file=buffer,
        )

        return transcription.text

    def get_scheduling_prompt(
        self, current_time: str, events_by_date: dict[str, list[dict]]
    ) -> str:
        self._read_base_prompt_from_file()
        self._populate_dynamic_content_in_prompt(current_time, events_by_date)

        return self.prompt

    def _read_base_prompt_from_file(self) -> None:
        with open(BASE_PROMPT_PATH, encoding=FILE_ENCODING) as file:
            self.prompt = file.read()

    def _populate_dynamic_content_in_prompt(
        self,
        current_time: str,
        events_by_date: dict[str, list[dict]],
    ) -> None:
        events_text = self._format_events_by_date(events_by_date)
        day = datetime.now(tz=UTC).strftime("%A, %B %d, %Y")

        self.prompt = self.prompt.replace(PLACEHOLDER_EVENTS, events_text)
        self.prompt = self.prompt.replace(PLACEHOLDER_TIME, current_time)
        self.prompt = self.prompt.replace(PLACEHOLDER_DAY, day)

    def _format_events_by_date(self, events_by_date: dict[str, list[dict]]) -> str:
        if not events_by_date:
            return NO_EVENTS_TEXT

        formatted_events = []

        for date_key in sorted(events_by_date.keys()):
            events = events_by_date[date_key]
            formatted_events.append(f"\n{date_key}:")

            for event in events:
                _id = event.get("id", "")
                title = event.get("title", NO_TITLE_TEXT)
                start_time = event.get("start_time", "")
                end_time = event.get("end_time", "")
                description = event.get("description", "")

                event_str = (
                    f"  - ID:{_id} | {start_time}-{end_time} | {title} | {description}"
                )
                formatted_events.append(event_str)

        return "\n".join(formatted_events)
