from sqlalchemy.orm import Session

from api.system.models.models import User


class UserRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def add(self, user: User) -> None:
        self.db.add(user)
        self.db.commit()

        self.db.refresh(user)

    def find_by_id(self, user_id: int) -> User | None:
        return self.db.query(User).filter_by(id=user_id).first()

    def find_by_email(self, email_address: str) -> User | None:
        return self.db.query(User).filter_by(email_address=email_address).first()
