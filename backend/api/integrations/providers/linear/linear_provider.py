import base64
import os
from typing import Any

import httpx

MAX_CONNECTIONS = 100
MAX_KEEPALIVE_CONNECTIONS = 20
CONNECT_TIMEOUT = 1.0
READ_TIMEOUT = 10.0
WRITE_TIMEOUT = 10.0
POOL_TIMEOUT = 5.0

_client = httpx.AsyncClient(
    http2=True,
    limits=httpx.Limits(
        max_keepalive_connections=MAX_KEEPALIVE_CONNECTIONS,
        max_connections=MAX_CONNECTIONS,
    ),
    timeout=httpx.Timeout(
        connect=CONNECT_TIMEOUT,
        read=READ_TIMEOUT,
        write=WRITE_TIMEOUT,
        pool=POOL_TIMEOUT,
    ),
)

LINEAR_URL = "https://api.linear.app/graphql"


class LinearProvider:
    client_id = os.environ.get("ALLOCATE_LINEAR_CLIENT_ID")
    client_secret = os.environ.get("ALLOCATE_LINEAR_CLIENT_SECRET")
    redirect_uri = os.environ.get("ALLOCATE_LINEAR_REDIRECT_URI")
    oauth_token_url = os.environ.get("ALLOCATE_LINEAR_OAUTH_TOKEN_URL")

    def get_oauth_url(self, state: str):
        linear_oauth_url = os.environ.get("ALLOCATE_LINEAR_AUTH_URL")

        if linear_oauth_url is None:
            msg = "Linear OAuth URL is empty"
            raise ValueError(msg)

        separator = "&" if "?" in linear_oauth_url else "?"

        if "state" not in linear_oauth_url:
            return f"{linear_oauth_url}{separator}state={state}"

        return f"{linear_oauth_url}"

    async def exchange_code_for_token(self, code: str) -> str:
        if (
            LinearProvider.client_id is None
            or LinearProvider.client_secret is None
            or LinearProvider.redirect_uri is None
            or LinearProvider.oauth_token_url is None
        ):
            msg = "A Linear variable is empty"
            raise ValueError(msg)

        data = {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": LinearProvider.redirect_uri,
            "client_id": LinearProvider.client_id,
            "client_secret": LinearProvider.client_secret,
        }

        headers = {
            "Content-Type": "application/x-www-form-urlencoded",
        }

        response = await _client.post(
            LinearProvider.oauth_token_url,
            data=data,
            headers=headers,
        )

        response.raise_for_status()
        return response.json()

    async def search(
        self,
        query: str,
        access_token: str,
    ) -> dict[str, Any]:
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        }

        document = """
            query SearchLinearIssues($term: String!) {
                searchIssues(
                    term: $term
                    includeComments: false
                ) {
                    nodes {
                        id
                        identifier
                        title
                        description
                        url
                    }
                }
            }
            """

        payload = {
            "query": document,
            "variables": {"term": query},
        }

        response = await _client.post(
            LINEAR_URL,
            json=payload,
            headers=headers,
        )

        response.raise_for_status()
        response_data = response.json()

        errors = response_data.get("errors")

        if errors:
            joined = (
                ", ".join(error.get("message", "Unknown error") for error in errors),
            )
            raise ValueError(joined)

        data = response_data.get("data")

        if data is None:
            msg = "Linear response missing data"
            raise ValueError(msg)

        issues = data.get("searchIssues")

        if issues is None:
            msg = "Linear response missing searchIssues field"
            raise ValueError(msg)

        return issues

    async def refresh_access_token(self, refresh_token: str) -> dict[str, Any]:
        if (
            LinearProvider.client_id is None
            or LinearProvider.client_secret is None
            or LinearProvider.redirect_uri is None
            or LinearProvider.oauth_token_url is None
        ):
            msg = "A Linear variable is empty"
            raise ValueError(msg)

        credentials = f"{LinearProvider.client_id}:{LinearProvider.client_secret}"
        encoded_credentials = base64.b64encode(credentials.encode()).decode()

        headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": f"Basic {encoded_credentials}",
        }

        response = await _client.post(
            LinearProvider.oauth_token_url,
            data={
                "grant_type": "refresh_token",
                "refresh_token": refresh_token,
            },
            headers=headers,
        )

        response.raise_for_status()
        return response.json()
