from api.system.schemas.base import FrozenBaseModel


class ChatInput(FrozenBaseModel):
    user_input: str


class ChatOutput(FrozenBaseModel):
    response: str
