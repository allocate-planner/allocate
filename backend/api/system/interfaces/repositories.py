from abc import ABC, abstractmethod


class Repository(ABC):
    @abstractmethod
    def add(self, entity):  # noqa: ANN001
        pass

    @abstractmethod
    def find_by_id(self, entity_id: int):
        pass

    @abstractmethod
    def delete(self, entity):  # noqa: ANN001
        pass
