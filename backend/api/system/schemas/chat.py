from api.system.schemas.base import FrozenBaseModel


class ChatInput(FrozenBaseModel):
    user_input: str
    session_id: str


class ChatOutput(FrozenBaseModel):
    response: str
    session_id: str
