from sqlalchemy import (
    Boolean,
    Column,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Time,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    first_name = Column(String(64), nullable=False)
    last_name = Column(String(64), nullable=False)
    email_address = Column(String(256), unique=True, index=True)
    password = Column(String(256), nullable=False)

    events = relationship("Event", back_populates="user")
    integrations = relationship("Integration", back_populates="user")


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    title = Column(String(256), nullable=False)
    description = Column(String(1024), nullable=True)
    location = Column(String(256), nullable=True)

    date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)

    colour = Column(String(256), nullable=False)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    user = relationship("User", back_populates="events")


class Integration(Base):
    __tablename__ = "integrations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    provider = Column(String(50), nullable=False)
    access_token = Column(String(255), nullable=False)
    refresh_token = Column(String(255), nullable=True)
    expires_at = Column(DateTime, nullable=True)
    scope = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)

    workspace_name = Column(String(255), nullable=True)
    workspace_id = Column(String(255), nullable=True)

    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    user = relationship("User", back_populates="integrations")
