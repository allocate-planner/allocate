from datetime import datetime

from sqlalchemy.orm import Session

from api.system.interfaces.repositories import Repository
from api.system.models.models import Integration


class IntegrationRepository(Repository):
    def __init__(self, db: Session) -> None:
        self.db = db

    def add(self, entity: Integration) -> None:
        self.db.query(Integration).filter_by()

        self.db.add(entity)
        self.db.commit()
        self.db.refresh(entity)

    def find_by_id(self, entity_id: int) -> Integration | None:
        return self.db.query(Integration).filter_by(id=entity_id).first()

    def find_by_user_and_provider(
        self,
        user_id: int,
        provider: str,
    ) -> Integration | None:
        return (
            self.db.query(Integration)
            .filter_by(user_id=user_id, provider=provider)
            .first()
        )

    def delete(self, entity: Integration) -> None:
        self.db.delete(entity)
        self.db.commit()

    def retrieve_integrations_for_user(
        self,
        user_id: int,
    ) -> list[Integration]:
        return self.db.query(Integration).filter(Integration.user_id == user_id).all()

    def retrieve_access_token_for_provider_for_user(
        self,
        user_id: int,
        provider: str,
    ) -> Integration | None:
        return (
            self.db.query(Integration)
            .filter(
                Integration.user_id == user_id,
                Integration.provider == provider,
            )
            .first()
        )

    def update_tokens(
        self,
        integration: Integration,
        access_token: str,
        refresh_token: str | None,
        expires_at: datetime | None,
    ) -> Integration:
        integration.access_token = access_token  # type: ignore  # noqa: PGH003
        integration.refresh_token = refresh_token  # type: ignore  # noqa: PGH003
        integration.expires_at = expires_at  # type: ignore  # noqa: PGH003

        self.db.commit()
        self.db.refresh(integration)

        return integration
