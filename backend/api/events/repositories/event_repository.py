from sqlalchemy.orm import Session

from api.system.models.models import Event


class EventRepository:
    def __init__(self, db: Session):
        self.db = db

    def add(self, event: Event) -> None:
        self.db.add(event)
        self.db.commit()

        self.db.refresh(event)

    def find_by_id(self, event_id: int) -> Event | None:
        return self.db.query(Event).filter_by(id=event_id).first()
