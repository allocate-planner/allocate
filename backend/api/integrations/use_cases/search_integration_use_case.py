from datetime import UTC, datetime, timedelta
from typing import Any

from api.integrations.providers.provider_registry import ProviderRegistry
from api.integrations.repositories.integration_repository import IntegrationRepository
from api.system.interfaces.use_cases import AsyncUseCase
from api.users.errors.user_not_found_error import UserNotFoundError
from api.users.repositories.user_repository import UserRepository


class SearchIntegrationUseCase(AsyncUseCase):
    def __init__(
        self,
        integration_repository: IntegrationRepository,
        user_repository: UserRepository,
    ) -> None:
        self.integration_repository = integration_repository
        self.user_repository = user_repository

    async def execute(
        self,
        query: str,
        current_user: str,
        provider: str,
    ) -> dict[str, Any]:
        user = self.user_repository.find_by_email(current_user)

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

        if integration is None:
            msg = "Integration not connected"
            raise ValueError(msg)

        access_token = str(integration.access_token)
        expires_at: datetime | None = integration.expires_at  # type: ignore  # noqa: PGH003

        if expires_at is not None:
            expires_at_utc = (
                expires_at.replace(tzinfo=UTC)
                if expires_at.tzinfo is None
                else expires_at.astimezone(UTC)
            )

            now_utc = datetime.now(UTC)

            if expires_at_utc < now_utc:
                if integration.refresh_token is None:
                    msg = "Refresh token is required to refresh access token"
                    raise ValueError(msg)

                token_response = await concrete_provider.refresh_access_token(
                    integration.refresh_token
                )

                new_access_token = token_response.get("access_token")
                new_refresh_token = token_response.get(
                    "refresh_token",
                    integration.refresh_token,
                )
                expires_in = token_response.get("expires_in")
                new_expires_at = (
                    now_utc + timedelta(seconds=expires_in) if expires_in else None
                )

                if new_access_token is None:
                    msg = "Linear response missing access_token"
                    raise ValueError(msg)

                self.integration_repository.update_tokens(
                    integration,
                    new_access_token,
                    new_refresh_token,
                    new_expires_at,
                )

                access_token = new_access_token

        return await concrete_provider.search(query, access_token)
