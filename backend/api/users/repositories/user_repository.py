from sqlalchemy.orm import Session

from api.system.interfaces.repositories import Repository
from api.system.models.models import User
from api.system.schemas.user import EditUser


class UserRepository(Repository):
    def __init__(self, db: Session) -> None:
        self.db = db

    def add(self, entity: User) -> None:
        self.db.add(entity)
        self.db.commit()

        self.db.refresh(entity)

    def find_by_id(self, entity_id: int) -> User | None:
        return self.db.query(User).filter_by(id=entity_id).first()

    def find_by_email(self, email_address: str) -> User | None:
        return self.db.query(User).filter_by(email_address=email_address).first()

    def edit(
        self,
        entity: User,
        updates: EditUser,
        hashed_password: str | None = None,
    ) -> User:
        for key, value in updates:
            if value is not None:
                if key == "password" and hashed_password is not None:
                    setattr(entity, key, hashed_password)
                elif key != "password":
                    setattr(entity, key, value)

        self.db.commit()
        self.db.refresh(entity)

        return entity

    def delete(self, entity: User) -> None:
        self.db.delete(entity)
        self.db.commit()
