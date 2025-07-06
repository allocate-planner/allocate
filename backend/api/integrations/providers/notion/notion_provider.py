import os


class NotionProvider:
    def get_oauth_url(self):
        notion_oauth_url = os.environ.get("ALLOCATE_NOTION_AUTH_URL")

        if notion_oauth_url is None:
            msg = "Notion OAuth URL is empty"
            raise ValueError(msg)

        return notion_oauth_url
