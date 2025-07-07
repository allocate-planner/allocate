from sqlalchemy.orm import Session

from api.system.models.models import Integration


class IntegrationRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def add(self, integration: Integration) -> None:
        self.db.add(integration)
        self.db.commit()

        self.db.refresh(integration)
