from api.integrations.providers.provider_registry import ProviderRegistry
from api.integrations.repositories.integration_repository import IntegrationRepository
from api.system.interfaces.use_cases import UseCase
from api.system.schemas.integration import OAuthConnect
from api.users.errors.user_not_found_error import UserNotFoundError
from api.users.repositories.user_repository import UserRepository


class ConnectIntegrationUseCase(UseCase):
    def __init__(
        self,
        integration_repository: IntegrationRepository,
        user_repository: UserRepository,
    ) -> None:
        self.integration_repository = integration_repository
        self.user_repository = user_repository

    def execute(self, provider: str, current_user: str) -> OAuthConnect:
        user = self.user_repository.find_by_email(current_user)

        if user is None:
            msg = "User not found"
            raise UserNotFoundError(msg)

        provider_cls = ProviderRegistry()
        concrete_provider_cls = provider_cls.get_provider(provider)

        concrete_provider = concrete_provider_cls()
        oauth_url = concrete_provider.get_oauth_url()

        oauth_connect = {
            "authorization_url": oauth_url,
            "provider": provider,
        }

        return OAuthConnect.model_validate(oauth_connect)
