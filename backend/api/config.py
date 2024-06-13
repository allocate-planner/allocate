import os


class Config: ...


class ProductionConfig(Config):
    DEVELOPMENT: bool = False
    DATABASE_URL: str | None = os.environ.get("ALLOCATE_DATABASE")
    DEBUG: bool = False
    ENV: str = "production"


class DevelopmentConfig(Config):
    DEVELOPMENT: bool = True
    DATABASE_URL: str | None = os.environ.get("ALLOCATE_DATABASE")
    DEBUG: bool = True
    ENV: str = "debug"
