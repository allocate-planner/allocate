from api.services.email_service import EmailService
from api.system.interfaces.use_cases import UseCase
from api.system.models.models import User
from api.system.schemas.user import User as UserSchema
from api.system.schemas.user import UserDetails
from api.users.errors.user_already_exists_error import UserAlreadyExistsError
from api.users.hashers.bcrypt_hasher import BCryptHasher
from api.users.repositories.user_repository import UserRepository


class RegisterUserUseCase(UseCase):
    def __init__(
        self,
        user_repository: UserRepository,
        bcrypt_hasher: BCryptHasher,
        email_service: EmailService,
    ) -> None:
        self.user_repository = user_repository
        self.bcrypt_hasher = bcrypt_hasher
        self.email_service = email_service

    def execute(self, request: UserDetails) -> UserSchema:
        if self.user_repository.find_by_email(request.email_address):
            msg = "User already exists."
            raise UserAlreadyExistsError(msg)

        hashed_password = self.bcrypt_hasher.hash(request.password)

        user = User(
            first_name=request.first_name,
            last_name=request.last_name,
            email_address=request.email_address,
            password=hashed_password,
        )

        self.user_repository.add(user)
        self.email_service.send_welcome_email(str(user.email_address))

        return user
