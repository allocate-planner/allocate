from datetime import date

from sqlalchemy.orm import Session

from api.system.models.models import Event
from api.system.schemas.event import EventBase


class EventRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def add(self, event: Event) -> None:
        self.db.add(event)
        self.db.commit()

        self.db.refresh(event)

    def find_by_id(self, event_id: int) -> Event | None:
        return self.db.query(Event).filter_by(id=event_id).first()

    def get_events(self, user_id: int, start_date: date, end_date: date) -> list[Event]:
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
            if hasattr(event, key):
                setattr(event, key, value)

        self.db.commit()
        self.db.refresh(event)

        return event

    def add_exdate(self, event: Event, exdate_entry: str) -> Event:
        if event.exdate is not None:
            existing = set(event.exdate.split(","))
            if exdate_entry not in existing:
                event.exdate = f"{event.exdate},{exdate_entry}"  # type: ignore  # noqa: PGH003
        else:
            event.exdate = exdate_entry  # type: ignore  # noqa: PGH003

        self.db.commit()
        self.db.refresh(event)

        return event

    def delete(self, event: Event) -> None:
        self.db.delete(event)
        self.db.commit()
