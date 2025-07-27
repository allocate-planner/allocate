from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException

from api.dependencies import get_current_user
from api.integrations.dependencies import (
    connect_integration_use_case,
    handle_redirect_use_case,
    retrieve_integrations_use_case,
)
from api.integrations.use_cases.connect_integration_use_case import (
    ConnectIntegrationUseCase,
)
from api.integrations.use_cases.handle_redirect_use_case import HandleRedirectUseCase
from api.integrations.use_cases.retrieve_integrations_use_case import (
    RetrieveIntegrationsUseCase,
)
from api.system.schemas.integration import (
    IntegrationCreate,
    OAuthCallbackData,
    OAuthConnect,
)
from api.users.errors.user_not_found_error import UserNotFoundError

integrations = APIRouter()


@integrations.post(
    "/api/v1/integrations/{provider}/connect",
    response_model=OAuthConnect,
)
def connect_integration(
    provider: str,
    connect_integration_use_case: Annotated[
        ConnectIntegrationUseCase,
        Depends(connect_integration_use_case),
    ],
    current_user: Annotated[str, Depends(get_current_user)],
):
    try:
        return connect_integration_use_case.execute(provider, current_user)
    except UserNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@integrations.post(
    "/api/v1/integrations/{provider}/redirect",
    response_model=IntegrationCreate,
)
async def handle_redirect_for_integration(
    provider: str,
    OAuthCallbackData: OAuthCallbackData,  # noqa: N803
    handle_redirect_use_case: Annotated[
        HandleRedirectUseCase,
        Depends(handle_redirect_use_case),
    ],
    current_user: Annotated[str, Depends(get_current_user)],
):
    try:
        return await handle_redirect_use_case.execute(
            OAuthCallbackData,
            provider,
            current_user,
        )
    except UserNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@integrations.get("/api/v1/integrations", response_model=dict[str, bool])
def retrieve_integrations(
    retrieve_integration_use_case: Annotated[
        RetrieveIntegrationsUseCase,
        Depends(retrieve_integrations_use_case),
    ],
    current_user: Annotated[str, Depends(get_current_user)],
):
    try:
        return retrieve_integration_use_case.execute(
            current_user,
        )
    except UserNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
