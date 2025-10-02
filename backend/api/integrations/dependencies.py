from typing import Annotated

from fastapi import Depends

from api.config import Config
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
from api.integrations.use_cases.search_integration_use_case import (
    SearchIntegrationUseCase,
)


def connect_integration_use_case(
    integration_repository: Annotated[
        IntegrationRepository,
        Depends(get_integration_repository),
    ],
    user_repository: Annotated[UserRepository, Depends(get_user_repository)],
    config: Annotated[Config, Depends(Config)],
) -> ConnectIntegrationUseCase:
    return ConnectIntegrationUseCase(integration_repository, user_repository, config)


def handle_redirect_use_case(
    integration_repository: Annotated[
        IntegrationRepository,
        Depends(get_integration_repository),
    ],
    user_repository: Annotated[UserRepository, Depends(get_user_repository)],
    config: Annotated[Config, Depends(Config)],
) -> HandleRedirectUseCase:
    return HandleRedirectUseCase(integration_repository, user_repository, config)


def retrieve_integrations_use_case(
    integration_repository: Annotated[
        IntegrationRepository,
        Depends(get_integration_repository),
    ],
    user_repository: Annotated[UserRepository, Depends(get_user_repository)],
) -> RetrieveIntegrationsUseCase:
    return RetrieveIntegrationsUseCase(integration_repository, user_repository)


def search_integration_use_case(
    integration_repository: Annotated[
        IntegrationRepository,
        Depends(get_integration_repository),
    ],
    user_repository: Annotated[UserRepository, Depends(get_user_repository)],
) -> SearchIntegrationUseCase:
    return SearchIntegrationUseCase(integration_repository, user_repository)
