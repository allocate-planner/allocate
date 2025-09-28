import os

import httpx

PLUNK_URL = "https://api.useplunk.com/v1/send"


class EmailService:
    def __init__(self) -> None:
        self.url = PLUNK_URL
        self.api_key = os.environ.get("PLUNK_API_KEY")

    def send_welcome_email(self, recipient: str) -> None:
        self.body = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to allocate</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet" type="text/css" />
    <style type="text/css">
      @import url(https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap);
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 60px 20px;">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; border-collapse: collapse;">
                    <tr>
                        <td align="center" style="padding-bottom: 60px;">
                            <img src="https://public-content-allocate.s3.eu-west-2.amazonaws.com/logo.png" alt="allocate Logo" width="176" height="50" style="display: block; margin: 0 auto; border: 0; outline: none;">
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-bottom: 30px;">
                            <h1 style="font-size: 48px; font-weight: 900; color: #111827; margin: 0; text-align: center; font-family: Inter, sans-serif;">Welcome!</h1>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-bottom: 40px;">
                            <p style="font-size: 14px; color: #9ca3af; line-height: 1.5; margin: 0 0 10px 0; text-align: center; font-family: Inter, sans-serif;">We're excited to have you on board and can't wait for you to get started.</p>
                            <p style="font-size: 14px; color: #9ca3af; line-height: 1.5; margin: 0; text-align: center; font-family: Inter, sans-serif;">Boost your productivity. Start using our app today.</p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-bottom: 60px;">
                            <a href="https://allocate.day/" style="display: inline-block; background-color: #111827; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500; font-family: Inter, sans-serif;">Get Started</a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
"""  # noqa: E501
        subject = "Welcome to allocate!"

        payload = {
            "to": recipient,
            "subject": subject,
            "body": self.body,
            "subscribed": True,
        }

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}",
        }

        httpx.request("POST", self.url, json=payload, headers=headers)
