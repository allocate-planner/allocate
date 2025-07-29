from api.system.interfaces.use_cases import UseCase
from api.system.schemas.user import EditUser as EditUserSchema
from api.system.schemas.user import User as UserSchema
from api.users.errors.user_not_found_error import UserNotFoundError
from api.users.hashers.bcrypt_hasher import BCryptHasher
from api.users.repositories.user_repository import UserRepository


class EditUserUseCase(UseCase):
    def __init__(
        self,
        user_repository: UserRepository,
        bcrypt_hasher: BCryptHasher,
    ) -> None:
        self.user_repository = user_repository
        self.bcrypt_hasher = bcrypt_hasher

    def execute(
        self,
        request: EditUserSchema,
        current_user: str,
    ) -> UserSchema:
        user = self.user_repository.find_by_email(current_user)

        if user is None:
            msg = "User not found"
            raise UserNotFoundError(msg)

        hashed_password = None
        if request.password is not None:
            hashed_password = self.bcrypt_hasher.hash(request.password)

        self.user_repository.edit(user, request, hashed_password)
        return UserSchema.model_validate(user)
