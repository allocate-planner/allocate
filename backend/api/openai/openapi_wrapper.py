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

    def prompt_chat(self, user_message: str) -> str:
        self._read_base_prompt_from_file()
        self._populate_dynamic_content_in_prompt()

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
        with open(BASE_PROMPT_PATH, "r", encoding="utf8") as file:
            self.prompt = file.read()

    def _populate_dynamic_content_in_prompt(self) -> None:
        CURRENT_TIME: str = "6:15am"  # temporary
        USER_NAME: str = "Jack"  # temporary

        self.prompt = self.prompt.format(
            work_start_time="09:00",
            work_end_time="17:00",
            work_start_day="Monday",
            work_end_day="Friday",
            commute_time="30 minutes",
            commute_type="car",
            start_meeting_1_time="09:00am",
            lunch_start_time="12:00",
            lunch_end_time="13:00",
            habit_1="reading",
            habit_explanation_1="finds it too difficult to focus",
        )

        self.prompt = f"{CURRENT_TIME}, {USER_NAME} | {self.prompt}"
