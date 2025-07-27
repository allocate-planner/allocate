from datetime import date

from sqlalchemy.orm import Session

from api.system.interfaces.repositories import Repository
from api.system.models.models import Event
from api.system.schemas.event import EventBase


class EventRepository(Repository):
    def __init__(self, db: Session) -> None:
        self.db = db

    def add(self, entity: Event) -> None:
        self.db.add(entity)
        self.db.commit()
        self.db.refresh(entity)

    def find_by_id(self, entity_id: int) -> Event | None:
        return self.db.query(Event).filter_by(id=entity_id).first()

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

    def edit(self, entity: Event, updates: EventBase) -> Event:
        for key, value in updates:
            if hasattr(entity, key):
                setattr(entity, key, value)

        self.db.commit()
        self.db.refresh(entity)

        return entity

    def add_exdate(self, entity: Event, exdate_entry: str) -> Event:
        if entity.exdate is not None:
            existing = set(entity.exdate.split(","))
            if exdate_entry not in existing:
                entity.exdate = f"{entity.exdate},{exdate_entry}"  # type: ignore  # noqa: PGH003
        else:
            entity.exdate = exdate_entry  # type: ignore  # noqa: PGH003

        self.db.commit()
        self.db.refresh(entity)

        return entity

    def delete(self, entity: Event) -> None:
        self.db.delete(entity)
        self.db.commit()
