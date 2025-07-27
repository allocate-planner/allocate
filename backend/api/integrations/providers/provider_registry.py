from api.integrations.providers.notion.notion_provider import NotionProvider


class ProviderRegistry:
    def __init__(self) -> None:
        self._providers: dict[str, type] = {
            "notion": NotionProvider,
        }

    def get_provider(self, provider_name: str) -> type:
        if provider_name not in self._providers:
            msg = f"Unknown provider: {provider_name}"
            raise ValueError(msg)
        return self._providers[provider_name]
