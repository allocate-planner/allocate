from typing import Annotated

from fastapi import Depends

from api.dependencies import (
    IntegrationRepository,
    UserRepository,
    get_integration_repository,
    get_user_repository,
)
from api.integrations.use_cases.connect_integration_use_case import (
    ConnectIntegrationUseCase,
)
from api.integrations.use_cases.handle_redirect_use_case import HandleRedirectUseCase
from api.integrations.use_cases.retrieve_integrations_use_case import (
    RetrieveIntegrationsUseCase,
)


def connect_integration_use_case(
    integration_repository: Annotated[
        IntegrationRepository,
        Depends(get_integration_repository),
    ],
    user_repository: Annotated[UserRepository, Depends(get_user_repository)],
) -> ConnectIntegrationUseCase:
    return ConnectIntegrationUseCase(integration_repository, user_repository)


def handle_redirect_use_case(
    integration_repository: Annotated[
        IntegrationRepository,
        Depends(get_integration_repository),
    ],
    user_repository: Annotated[UserRepository, Depends(get_user_repository)],
) -> HandleRedirectUseCase:
    return HandleRedirectUseCase(integration_repository, user_repository)


def retrieve_integrations_use_case(
    integration_repository: Annotated[
        IntegrationRepository,
        Depends(get_integration_repository),
    ],
    user_repository: Annotated[UserRepository, Depends(get_user_repository)],
) -> RetrieveIntegrationsUseCase:
    return RetrieveIntegrationsUseCase(integration_repository, user_repository)
