import secrets
from datetime import UTC, datetime, timedelta

import jwt

from api.config import Config
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
        config: Config,
    ) -> None:
        self.integration_repository = integration_repository
        self.user_repository = user_repository
        self.config = config

    def execute(self, provider: str, current_user: str) -> OAuthConnect:
        user = self.user_repository.find_by_email(current_user)

        if user is None:
            msg = "User not found"
            raise UserNotFoundError(msg)

        provider_cls = ProviderRegistry()
        concrete_provider_cls = provider_cls.get_provider(provider)

        concrete_provider = concrete_provider_cls()
        state = self._generate_state(current_user, provider)
        oauth_url = concrete_provider.get_oauth_url(state)

        oauth_connect = {
            "authorization_url": oauth_url,
            "provider": provider,
            "state": state,
        }

        return OAuthConnect.model_validate(oauth_connect)

    def _generate_state(self, current_user: str, provider: str) -> str:
        if not self.config.JWT_SECRET_KEY:
            msg = "Missing JWT secret"
            raise ValueError(msg)

        expiry = datetime.now(UTC) + timedelta(minutes=10)

        payload = {
            "sub": current_user,
            "provider": provider,
            "nonce": secrets.token_urlsafe(16),
            "exp": expiry,
        }

        return jwt.encode(
            payload,
            self.config.JWT_SECRET_KEY,
            algorithm=self.config.JWT_ALGORITHM,
        )
