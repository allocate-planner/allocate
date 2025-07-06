from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException

from api.dependencies import get_current_user
from api.integrations.dependencies import connect_integration_use_case
from api.integrations.use_cases.connect_integration_use_case import (
    ConnectIntegrationUseCase,
)

integrations = APIRouter()


@integrations.post("/api/v1/integrations/{provider}/connect", response_model=None)
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
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@integrations.post("/api/v1/integrations/{provider}/redirect", response_model=None)
def handle_redirect_for_integration(
    provider: str,
    connect_integration_use_case: Annotated[
        ConnectIntegrationUseCase,
        Depends(connect_integration_use_case),
    ],
    current_user: Annotated[str, Depends(get_current_user)],
):
    try:
        return connect_integration_use_case.execute(provider, current_user)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
