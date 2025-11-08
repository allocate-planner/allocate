import base64
import os
from datetime import datetime
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

NOTION_URL = "https://api.notion.com/v1/"


class NotionProvider:
    client_id = os.environ.get("ALLOCATE_NOTION_CLIENT_ID")
    client_secret = os.environ.get("ALLOCATE_NOTION_SECRET")
    redirect_uri = os.environ.get("ALLOCATE_NOTION_REDIRECT_URI")

    def get_oauth_url(self, state: str):
        notion_oauth_url = os.environ.get("ALLOCATE_NOTION_AUTH_URL")

        if notion_oauth_url is None:
            msg = "Notion OAuth URL is empty"
            raise ValueError(msg)

        separator = "&" if "?" in notion_oauth_url else "?"

        if "state" not in notion_oauth_url:
            return f"{notion_oauth_url}{separator}state={state}"

        return f"{notion_oauth_url}"

    async def exchange_code_for_token(self, code: str) -> str:
        if (
            NotionProvider.client_id is None
            or NotionProvider.client_secret is None
            or NotionProvider.redirect_uri is None
        ):
            msg = "A Notion variable is empty"
            raise ValueError(msg)

        data = {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": NotionProvider.redirect_uri,
        }

        credentials = f"{NotionProvider.client_id}:{NotionProvider.client_secret}"
        encoded_credentials = base64.b64encode(credentials.encode()).decode()

        headers = {
            "Authorization": f"Basic {encoded_credentials}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }

        response = await _client.post(
            f"{NOTION_URL}oauth/token",
            json=data,
            headers=headers,
        )

        response.raise_for_status()
        return response.json()

    async def search(
        self,
        query: str,
        access_token: str,
    ) -> dict[str, Any]:
        data = {
            "query": query,
        }

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Notion-Version": "2022-06-28",
        }

        response = await _client.post(
            f"{NOTION_URL}search",
            json=data,
            headers=headers,
        )

        response.raise_for_status()
        return response.json()
