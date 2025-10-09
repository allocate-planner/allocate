from typing import Any

from langfuse import observe
from langfuse.langchain import CallbackHandler
from langgraph.prebuilt import create_react_agent

from api.infrastructure.ai.chat_openrouter import ChatOpenRouter
from api.infrastructure.ai.tools_service import ToolsService
from api.infrastructure.ai.transcription_service import TranscriptionService

LLM_MODEL: str = "qwen/qwen3-235b-a22b-2507"
LLM_TEMPERATURE: float = 0

handler = CallbackHandler()


class SchedulingService:
    def __init__(
        self,
        transcription_service: TranscriptionService,
        tools_service: ToolsService,
    ) -> None:
        self.transcription_service = transcription_service
        self.tools_service = tools_service

    def _create_scheduling_agent(
        self,
        current_time: str,
        events_by_date: dict[str, list[dict]],
        current_user: str,
    ) -> Any:  # noqa: ANN401
        llm = ChatOpenRouter(
            model=LLM_MODEL,
            temperature=LLM_TEMPERATURE,
            extra_body={"provider": {"sort": "throughput"}},
        )
        tools = self.tools_service.get_tools_for_user(current_user)
        prompt = self.transcription_service.get_scheduling_prompt(
            current_time, events_by_date
        )

        return create_react_agent(model=llm, tools=tools, prompt=prompt)

    @observe()
    async def get_scheduling_response(
        self,
        current_time: str,
        user_message: str,
        events_by_date: dict[str, list[dict]],
        current_user: str,
        langfuse_session_id: str,
    ) -> str:
        agent = self._create_scheduling_agent(
            current_time,
            events_by_date,
            current_user,
        )
        result = await agent.ainvoke(
            {"messages": [{"role": "user", "content": user_message}]},
            config={
                "callbacks": [handler],
                "metadata": {
                    "langfuse_session_id": langfuse_session_id,
                    "langfuse_user_id": current_user,
                },
            },
        )
        return self._extract_response_content(result)

    def _extract_response_content(self, result: dict) -> str:
        last_message = result["messages"][-1]
        return last_message.content
