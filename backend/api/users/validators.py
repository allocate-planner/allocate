import re


class EmailAddressValidator:
    def __init__(self) -> None:
        self.email_address_regex = re.compile(
            r"^[A-Za-z0-9\.\+_-]+@[A-Za-z0-9\._-]+\.[a-zA-Z]*$", re.IGNORECASE
        )

    def validate_email_address(self, email_address: str) -> str | None:
        if not email_address:
            return "Email is required"
        elif not self.email_address_regex.match(email_address):
            return "Invalid email address"

    def validate_user_email_address(self, email_address: str) -> str | None:
        return self.validate_email_address(email_address)


class PasswordValidator:
    def validate_password(self, password: str) -> str | None:
        if not password:
            return "Password is required"
        elif len(password) < 8:
            return "Password must be at least 8 characters long"

    def validate_user_password(self, password: str) -> str | None:
        return self.validate_password(password)
