from typing import Any

from api.integrations.providers.provider_registry import ProviderRegistry
from api.integrations.repositories.integration_repository import IntegrationRepository
from api.users.errors.user_not_found_error import UserNotFoundError
from api.users.repositories.user_repository import UserRepository


class SearchNotionUseCase:
    def __init__(
        self,
        integration_repository: IntegrationRepository,
        user_repository: UserRepository,
    ) -> None:
        self.integration_repository = integration_repository
        self.user_repository = user_repository

    async def execute(self, current_user: str) -> dict[str, Any]:
        user = self.user_repository.find_by_email(current_user)
        provider = "notion"

        if user is None:
            msg = "User not found"
            raise UserNotFoundError(msg)

        provider_cls = ProviderRegistry()
        concrete_provider_cls = provider_cls.get_provider(provider)

        concrete_provider = concrete_provider_cls()

        integration = (
            self.integration_repository.retrieve_access_token_for_provider_for_user(
                user.id,  # type: ignore  # noqa: PGH003
                provider,
            )
        )

        return await concrete_provider.search("Rules", integration.access_token)
