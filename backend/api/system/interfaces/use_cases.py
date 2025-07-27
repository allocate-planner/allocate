from abc import ABC, abstractmethod
from typing import Any


class UseCase(ABC):
    @abstractmethod
    def execute(self, *args: Any, **kwargs: Any) -> Any:  # noqa: ANN401
        pass


class AsyncUseCase(ABC):
    @abstractmethod
    async def execute(self, *args: Any, **kwargs: Any) -> Any:  # noqa: ANN401
        pass
