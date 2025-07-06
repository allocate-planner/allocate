from sqlalchemy.orm import Session


class IntegrationRepository:
    def __init__(self, db: Session) -> None:
        self.db = db
