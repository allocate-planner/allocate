from api.system.models.models import User

from api.system.schemas.schemas import UserDetails
from api.system.schemas.schemas import User as UserSchema

from api.users.repositories.user_repository import UserRepository

from api.users.errors.user_already_exists import UserAlreadyExists

from api.users.hashers.bcrypt_hasher import BCryptHasher


class RegisterUserUseCase:
    def __init__(
        self, user_repository: UserRepository, bcrypt_hasher: BCryptHasher
    ) -> None:
        self.user_repository = user_repository
        self.bcrypt_hasher = bcrypt_hasher

    def execute(self, request: UserDetails) -> UserSchema:
        if self.user_repository.find_by_email(request.email_address):
            raise UserAlreadyExists("User already exists")

        hashed_password = self.bcrypt_hasher.hash(request.password)

        user = User(email_address=request.email_address, password=hashed_password)

        self.user_repository.add(user)

        return user
