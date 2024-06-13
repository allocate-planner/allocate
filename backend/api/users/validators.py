import re

from typing import Dict, Any


class EmailAddressValidator:
    def __init__(self) -> None:
        self.validation_errors = {}
        self.email_address_regex = re.compile(
            r"^[A-Za-z0-9\.\+_-]+@[A-Za-z0-9\._-]+\.[a-zA-Z]*$", re.IGNORECASE
        )

    def validate_email_address(self, email_address: str) -> None:
        if not email_address:
            self.validation_errors["email_address"] = "Email is required"
        elif not self.email_address_regex.match(email_address):
            self.validation_errors["email_address"] = "Invalid email address"

    def validate_user_email_address(
        self, email_address: str | None = None
    ) -> Dict[str, Any]:
        self.validation_errors = {}

        if email_address:
            self.validate_email_address(email_address)

        return self.validation_errors


class PasswordValidator:
    def __init__(self) -> None:
        self.validation_errors = {}

    def validate_password(self, password: str) -> None:
        if not password:
            self.validation_errors["password"] = "Password is required"
        elif len(password) < 8:
            self.validation_errors["password"] = (
                "Password must be at least 8 characters long"
            )

    def validate_user_password(self, password: str) -> Dict[str, Any]:
        self.validation_errors = {}
        self.validate_password(password)

        return self.validation_errors
