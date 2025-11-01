import os

from openai import AsyncOpenAI

EXA_URL = "https://api.exa.ai"
EXA_API_KEY = os.environ.get("ALLOCATE_EXA_API_KEY", "")


class ExaConnector:
    def __init__(self, api_key: str | None = None) -> None:
        exa_api_key = api_key or EXA_API_KEY

        if not exa_api_key:
            msg = "ALLOCATE_EXA_API_KEY is not set"
            raise ValueError(msg)

        self.client = AsyncOpenAI(
            base_url=EXA_URL,
            api_key=exa_api_key,
        )
