import asyncio
from typing import Any

from langchain_core.tools import tool

from api.integrations.use_cases.search_notion_use_case import SearchNotionUseCase


class ToolsService:
    def __init__(self, search_notion_use_case: SearchNotionUseCase) -> None:
        self.search_notion_use_case = search_notion_use_case

    def get_tools_for_user(self, current_user: str) -> list:
        @tool
        def search_notion(query: str) -> dict[str, Any]:
            """Search user's Notion workspace for documents, pages, or databases."""
            try:
                return asyncio.run(
                    self.search_notion_use_case.execute(query, current_user),
                )
            except Exception as e:
                return {"Error": str(e)}

        return [search_notion]
