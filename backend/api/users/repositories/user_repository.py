from sqlalchemy.orm import Session

from api.system.interfaces.repositories import Repository
from api.system.models.models import User


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
