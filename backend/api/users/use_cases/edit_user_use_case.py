from api.system.interfaces.use_cases import UseCase
from api.system.schemas.user import EditUser as EditUserSchema
from api.system.schemas.user import UserBase as UserBaseSchema
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
    ) -> UserBaseSchema:
        user = self.user_repository.find_by_email(current_user)

        if user is None:
            msg = "User not found"
            raise UserNotFoundError(msg)

        hashed_password = None
        if request.password is not None:
            hashed_password = self.bcrypt_hasher.hash(request.password)

        self.user_repository.edit(user, request, hashed_password)

        user_base = UserBaseSchema(
            first_name=str(user.first_name),
            last_name=str(user.last_name),
            email_address=str(user.email_address),
        )

        return UserBaseSchema.model_validate(user_base)
