from datetime import datetime
from enum import Enum
from typing import Annotated

from pydantic import StringConstraints

from api.system.schemas.base import FrozenBaseModel


class ProviderEnum(str, Enum):
    NOTION = "notion"
    GMAIL = "gmail"
    LINEAR = "linear"
    GITHUB = "github"
    FIGMA = "figma"
    SLACK = "slack"


class OAuthCallbackData(FrozenBaseModel):
    code: Annotated[
        str,
        StringConstraints(strip_whitespace=True, max_length=256),
    ]


class OAuthConnect(FrozenBaseModel):
    authorization_url: Annotated[
        str,
        StringConstraints(strip_whitespace=True, max_length=256),
    ]
    provider: Annotated[
        str,
        StringConstraints(strip_whitespace=True, max_length=256),
    ]


class IntegrationBase(FrozenBaseModel):
    bot_id: Annotated[
        str | None,
        StringConstraints(strip_whitespace=True, max_length=256),
    ] = None

    provider: Annotated[
        str,
        StringConstraints(strip_whitespace=True, max_length=256),
    ]
    access_token: Annotated[
        str,
        StringConstraints(strip_whitespace=True, max_length=256),
    ]

    refresh_token: Annotated[
        str | None,
        StringConstraints(strip_whitespace=True, max_length=256),
    ] = None
    expires_at: datetime | None = None
    scope: Annotated[
        str | None,
        StringConstraints(strip_whitespace=True, max_length=256),
    ] = None
    is_active: bool = True
    workspace_name: Annotated[
        str | None,
        StringConstraints(strip_whitespace=True, max_length=256),
    ] = None
    workspace_id: Annotated[
        str | None,
        StringConstraints(strip_whitespace=True, max_length=256),
    ] = None
    user_id: int


class IntegrationCreate(IntegrationBase):
    pass
