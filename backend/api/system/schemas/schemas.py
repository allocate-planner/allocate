from pydantic import BaseModel


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
