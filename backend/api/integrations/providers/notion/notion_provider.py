import base64
import os

import httpx

NOTION_URL = "https://api.notion.com/v1/oauth/token"


class NotionProvider:
    def get_oauth_url(self):
        notion_oauth_url = os.environ.get("ALLOCATE_NOTION_AUTH_URL")

        if notion_oauth_url is None:
            msg = "Notion OAuth URL is empty"
            raise ValueError(msg)

        return notion_oauth_url

    async def exchange_code_for_token(self, code: str) -> str:
        client_id = os.environ.get("ALLOCATE_NOTION_CLIENT_ID")
        client_secret = os.environ.get("ALLOCATE_NOTION_SECRET")
        redirect_uri = os.environ.get("ALLOCATE_NOTION_REDIRECT_URI")

        if client_id is None or client_secret is None or redirect_uri is None:
            msg = "A Notion variable is empty"
            raise ValueError(msg)

        data = {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": redirect_uri,
        }

        credentials = f"{client_id}:{client_secret}"
        encoded_credentials = base64.b64encode(credentials.encode()).decode()

        headers = {
            "Authorization": f"Basic {encoded_credentials}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(NOTION_URL, json=data, headers=headers)
            response.raise_for_status()
            return response.json()
