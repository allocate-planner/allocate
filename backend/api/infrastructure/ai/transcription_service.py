from datetime import UTC, datetime
from io import BytesIO

from openai import OpenAI

BASE_PROMPT_PATH: str = "base.prompt"
TRANSCRIPTION_MODEL: str = "whisper-1"
FILE_ENCODING: str = "utf8"

PLACEHOLDER_EVENTS: str = "{events}"
PLACEHOLDER_TIME: str = "{time}"
PLACEHOLDER_DAY: str = "{day}"

NO_EVENTS_TEXT: str = "No events scheduled"
NO_TITLE_TEXT: str = "(no title)"


class TranscriptionService:
    def __init__(self) -> None:
        self.client = OpenAI()
        self.prompt = ""

    def transcribe_audio(self, buffer: BytesIO) -> str:
        transcription = self.client.audio.transcriptions.create(
            model=TRANSCRIPTION_MODEL,
            file=buffer,
        )

        return transcription.text

    def get_scheduling_prompt(self, current_time: str, events: list[dict]) -> str:
        self._read_base_prompt_from_file()
        self._populate_dynamic_content_in_prompt(current_time, events)

        return self.prompt

    def _read_base_prompt_from_file(self) -> None:
        with open(BASE_PROMPT_PATH, encoding=FILE_ENCODING) as file:
            self.prompt = file.read()

    def _populate_dynamic_content_in_prompt(
        self,
        current_time: str,
        events: list[dict],
    ) -> None:
        events_text = self._format_events_for_prompt(events)
        day = datetime.now(tz=UTC).strftime("%A")

        self.prompt = self.prompt.replace(PLACEHOLDER_EVENTS, events_text)
        self.prompt = self.prompt.replace(PLACEHOLDER_TIME, current_time)
        self.prompt = self.prompt.replace(PLACEHOLDER_DAY, day)

    def _format_events_for_prompt(self, events: list[dict]) -> str:
        if not events:
            return NO_EVENTS_TEXT

        formatted_events = []
        for event in events:
            title = event.get("title", NO_TITLE_TEXT)
            start_time = event.get("start_time", "")
            end_time = event.get("end_time", "")

            event_str = f"{start_time}|{end_time}|{title}"
            formatted_events.append(event_str)

        return "\n".join(formatted_events)
