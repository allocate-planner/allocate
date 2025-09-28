from api.integrations.providers.provider_registry import ProviderRegistry
from api.integrations.repositories.integration_repository import IntegrationRepository
from api.system.interfaces.use_cases import UseCase
from api.system.models.models import Integration
from api.system.schemas.integration import IntegrationCreate, OAuthCallbackData
from api.users.errors.user_not_found_error import UserNotFoundError
from api.users.repositories.user_repository import UserRepository


class HandleRedirectUseCase(UseCase):
    def __init__(
        self,
        integration_repository: IntegrationRepository,
        user_repository: UserRepository,
    ) -> None:
        self.integration_repository = integration_repository
        self.user_repository = user_repository

    async def execute(
        self,
        OAuthCallbackData: OAuthCallbackData,  # noqa: N803
        provider: str,
        current_user: str,
    ) -> IntegrationCreate:
        user = self.user_repository.find_by_email(current_user)

        if user is None:
            msg = "User not found"
            raise UserNotFoundError(msg)

        provider_cls = ProviderRegistry()
        concrete_provider_cls = provider_cls.get_provider(provider)

        concrete_provider = concrete_provider_cls()

        token_response = await concrete_provider.exchange_code_for_token(
            OAuthCallbackData.code,
        )

        integration_data = {
            "provider": provider,
            "access_token": token_response["access_token"],
            "user_id": user.id,
        }

        optional_fields = [
            "refresh_token",
            "expires_at",
            "scope",
            "workspace_name",
            "workspace_id",
            "bot_id",
        ]

        for field in optional_fields:
            if field in token_response:
                integration_data[field] = token_response[field]

        integration = Integration(**integration_data)

        db_integration = self.integration_repository.find_by_user_and_provider(
            user.id,  # type: ignore  # noqa: PGH003
            provider,
        )

        if db_integration is None:
            self.integration_repository.add(integration)

            return IntegrationCreate.model_validate(integration)

        self.integration_repository.delete(db_integration)
        self.integration_repository.add(integration)

        return IntegrationCreate.model_validate(integration)
