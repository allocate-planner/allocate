from io import BytesIO

from openai import OpenAI


class OpenAIWrapper:
    def __init__(self) -> None:
        self.client = OpenAI()

    def transcribe_audio(self, buffer: BytesIO) -> str:
        transcription = self.client.audio.transcriptions.create(
            model="whisper-1",
            file=buffer,
        )

        return transcription.text
