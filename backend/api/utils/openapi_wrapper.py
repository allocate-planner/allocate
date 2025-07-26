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

    def prompt_chat(self, first_name: str, current_time: str, user_message: str) -> str:
        self._read_base_prompt_from_file()
        self._populate_dynamic_content_in_prompt(first_name, current_time)

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
        first_name: str,
        current_time: str,
    ) -> None:
        self.prompt = f"{current_time}, {first_name} | {self.prompt}"
