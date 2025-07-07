from api.integrations.repositories.integration_repository import IntegrationRepository
from api.system.schemas.integration import ProviderEnum
from api.users.errors.user_not_found_error import UserNotFoundError
from api.users.repositories.user_repository import UserRepository


class RetrieveIntegrationsUseCase:
    def __init__(
        self,
        integration_repository: IntegrationRepository,
        user_repository: UserRepository,
    ) -> None:
        self.integration_repository = integration_repository
        self.user_repository = user_repository

    def execute(self, current_user: str) -> dict[str, bool]:
        user = self.user_repository.find_by_email(current_user)

        if user is None:
            msg = "User not found"
            raise UserNotFoundError(msg)

        integrations = self.integration_repository.retrieve_integrations_for_user(
            user.id,  # type: ignore  # noqa: PGH003
        )

        integrations_map = {provider.value: False for provider in ProviderEnum}

        for integration in integrations:
            provider = str(integration.provider)
            if provider in integrations_map:
                integrations_map[provider] = True

        return integrations_map
