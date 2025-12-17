from langfuse import observe
from langfuse.langchain import CallbackHandler

from api.ai.connectors.openrouter_connector import OpenRouterConnector
from api.ai.services.prompt_service import PromptService

LLM_MODEL: str = "openai/gpt-oss-120b"
LLM_TEMPERATURE: float = 0

CHAT_PROMPT_PATH: str = "api/prompts/chat.prompt"

handler = CallbackHandler()


class ChatService:
    def __init__(self) -> None:
        self.prompt_service = PromptService(CHAT_PROMPT_PATH)

    @observe()
    async def get_chat_response(
        self,
        current_time: str,
        user_message: str,
        events_by_date: dict[str, list[dict]],
        current_user: str,
    ) -> str:
        llm = OpenRouterConnector(
            model=LLM_MODEL,
            temperature=LLM_TEMPERATURE,
            extra_body={"provider": {"sort": "throughput"}},
        )

        prompt = self.prompt_service.get_prompt(current_time, events_by_date)

        result = await llm.ainvoke(
            [
                {"role": "system", "content": prompt},
                {"role": "user", "content": user_message},
            ],
            config={
                "callbacks": [handler],
                "metadata": {
                    "langfuse_user_id": current_user,
                },
            },
        )

        return str(result.content)
