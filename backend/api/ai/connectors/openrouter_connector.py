import os

from langchain_openai import ChatOpenAI
from pydantic import Field, SecretStr

OPENROUTER_URL = "https://openrouter.ai/api/v1"
OPENROUTER_API_KEY = os.environ.get("ALLOCATE_OPENROUTER_API_KEY", "")


class OpenRouterConnector(ChatOpenAI):
    openai_api_key: SecretStr | None = Field(
        alias="api_key",
        default_factory=lambda: OPENROUTER_API_KEY,
    )

    @property
    def lc_secrets(self) -> dict[str, str]:
        return {"openai_api_key": "ALLOCATE_OPENROUTER_API_KEY"}

    def __init__(self, openai_api_key: str | None = None, **kwargs) -> None:  # noqa: ANN003
        llm_api_key = openai_api_key or OPENROUTER_API_KEY

        if llm_api_key is None or llm_api_key == "":
            msg = "ALLOCATE_OPENROUTER_API_KEY is not set"
            raise ValueError(msg)

        super().__init__(
            base_url=OPENROUTER_URL,
            api_key=SecretStr(llm_api_key),
            **kwargs,
        )
