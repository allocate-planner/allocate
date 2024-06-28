from pydantic import BaseModel

from datetime import date, time


class UserBase(BaseModel):
    email_address: str


class UserDetails(UserBase):
    password: str


class User(UserBase):
    id: int

    class Config:
        from_attributes = True


class UserWithToken(UserBase):
    id: int

    access_token: str
    refresh_token: str

    class Config:
        from_attributes = True


class EventBase(BaseModel):
    title: str
    date: date
    start_time: time
    end_time: time


class Event(EventBase):
    id: int

    class Config:
        from_attributes = True
