from typing import List

from datetime import date

from sqlalchemy.orm import Session

from api.system.models.models import Event

from api.system.schemas.schemas import EventBase


class EventRepository:
    def __init__(self, db: Session):
        self.db = db

    def add(self, event: Event) -> None:
        self.db.add(event)
        self.db.commit()

        self.db.refresh(event)

    def find_by_id(self, event_id: int) -> Event | None:
        return self.db.query(Event).filter_by(id=event_id).first()

    def get_events(self, user_id: int, start_date: date, end_date: date) -> List[Event]:
        return (
            self.db.query(Event)
            .filter(
                Event.user_id == user_id,
                Event.date >= start_date,
                Event.date <= end_date,
            )
            .all()
        )

    def edit(self, event: Event, updates: EventBase) -> Event:
        for key, value in updates:
            setattr(event, key, value)

        self.db.commit()
        self.db.refresh(event)

        return event

    def delete(self, event: Event) -> None:
        self.db.delete(event)
        self.db.commit()
