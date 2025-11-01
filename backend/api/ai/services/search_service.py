from typing import Any

from api.ai.connectors.exa_connector import ExaConnector

EXA_MODEL = "exa-fast-preview"


class SearchService:
    def __init__(self, exa_connector: ExaConnector) -> None:
        self.exa_connector = exa_connector

    async def search(self, query: str) -> dict[str, Any]:
        response = await self.exa_connector.client.chat.completions.create(
            model=EXA_MODEL,
            messages=[{"role": "user", "content": query}],
        )

        return {"content": response.choices[0].message.content}
