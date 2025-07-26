from io import BytesIO

from openai import OpenAI

BASE_PROMPT_PATH: str = "base.prompt"


class OpenAIWrapper:
    def __init__(self) -> None:
        self.client = OpenAI()
        self.prompt = ""

    def transcribe_audio(self, buffer: BytesIO) -> str:
        transcription = self.client.audio.transcriptions.create(
            model="whisper-1",
            file=buffer,
        )

        return transcription.text

    def prompt_chat(
        self,
        current_time: str,
        user_message: str,
        events: list[dict] | None = None,
    ) -> str:
        self._read_base_prompt_from_file()
        self._populate_dynamic_content_in_prompt(current_time, events or [])

        chat_completion = self.client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": self.prompt},
                {"role": "user", "content": user_message},
            ],
            max_tokens=2048,
            temperature=0,
        )

        return str(chat_completion.choices[0].message.content)

    def _read_base_prompt_from_file(self) -> None:
        with open(BASE_PROMPT_PATH, encoding="utf8") as file:
            self.prompt = file.read()

    def _populate_dynamic_content_in_prompt(
        self,
        current_time: str,
        events: list[dict],
    ) -> None:
        events_text = self._format_events_for_prompt(events)
        self.prompt = self.prompt.replace("{events}", events_text)
        self.prompt = self.prompt.replace("{time}", current_time)

    def _format_events_for_prompt(self, events: list[dict]) -> str:
        if not events:
            return "No events scheduled"

        formatted_events = []
        for event in events:
            title = event.get("title", "(no title)")
            start_time = event.get("start_time", "")
            end_time = event.get("end_time", "")

            event_str = f"{start_time}|{end_time}|{title}"
            formatted_events.append(event_str)

        return "\n".join(formatted_events)
