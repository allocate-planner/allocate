import os

from langchain_openai import ChatOpenAI
from pydantic import Field, SecretStr


class ChatOpenRouter(ChatOpenAI):
    openai_api_key: SecretStr | None = Field(
        alias="api_key",
        default_factory=lambda: os.environ.get("ALLOCATE_OPENROUTER_API_KEY"),
    )

    @property
    def lc_secrets(self) -> dict[str, str]:
        return {"openai_api_key": "ALLOCATE_OPENROUTER_API_KEY"}

    def __init__(self, openai_api_key: str | None = None, **kwargs) -> None:  # noqa: ANN003
        openai_api_key = openai_api_key or os.environ.get("ALLOCATE_OPENROUTER_API_KEY")

        if openai_api_key is None:
            msg = "ALLOCATE_OPENROUTER_API_KEY is not set"
            raise ValueError(msg)

        super().__init__(
            base_url="https://openrouter.ai/api/v1",
            api_key=SecretStr(openai_api_key),
            **kwargs,
        )
