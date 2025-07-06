from pydantic import BaseModel, ConfigDict


class FrozenBaseModel(BaseModel):
    model_config: ConfigDict = ConfigDict(  # type: ignore  # noqa: PGH003
        frozen=True,
        extra="ignore",
        from_attributes=True,
    )
