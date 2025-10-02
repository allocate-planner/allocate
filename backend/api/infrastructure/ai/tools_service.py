from typing import Any

from langchain_core.tools import tool

from api.integrations.use_cases.search_integration_use_case import (
    SearchIntegrationUseCase,
)

NOTION_PROVIDER = "notion"
LINEAR_PROVIDER = "linear"


class ToolsService:
    def __init__(self, search_integration_use_case: SearchIntegrationUseCase) -> None:
        self.search_integration_use_case = search_integration_use_case

    def get_tools_for_user(self, current_user: str) -> list:
        @tool
        async def search_notion(query: str) -> dict[str, Any]:
            """Search user's Notion workspace for documents, pages, or databases."""
            try:
                return await self.search_integration_use_case.execute(
                    query,
                    current_user,
                    NOTION_PROVIDER,
                )
            except Exception as e:
                return {"Error": str(e)}

        @tool
        async def search_linear(query: str) -> dict[str, Any]:
            """Search user's Linear workspace for issues."""
            try:
                return await self.search_integration_use_case.execute(
                    query,
                    current_user,
                    LINEAR_PROVIDER,
                )
            except Exception as e:
                return {"Error": str(e)}

        return [search_notion, search_linear]
