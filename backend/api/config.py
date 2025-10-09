import os


class Config:
    DATABASE_URL: str | None = os.environ.get("ALLOCATE_DATABASE")

    PLUNK_API_KEY: str | None = os.environ.get("ALLOCATE_PLUNK_API_KEY")

    LANGFUSE_PUBLIC_KEY: str | None = os.environ.get("LANGFUSE_PUBLIC_KEY")
    LANGFUSE_SECRET_KEY: str | None = os.environ.get("LANGFUSE_SECRET_KEY")
    LANGFUSE_HOST: str | None = os.environ.get("LANGFUSE_HOST")

    JWT_SECRET_KEY: str | None = os.environ.get("ALLOCATE_JWT_SECRET_KEY")
    JWT_REFRESH_SECRET_KEY: str | None = os.environ.get("ALLOCATE_JWT_REFRESH_KEY")
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 43800
    JWT_REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7


class ProductionConfig(Config):
    DEVELOPMENT: bool = False
    DEBUG: bool = False
    ENV: str = "production"

    os.environ["LANGFUSE_TRACING_ENVIRONMENT"] = "production"


class DevelopmentConfig(Config):
    DEVELOPMENT: bool = True
    DEBUG: bool = True
    ENV: str = "debug"

    os.environ["LANGFUSE_TRACING_ENVIRONMENT"] = "development"


def get_config() -> Config:
    env = os.environ.get("ALLOCATE_ENV", "development").lower()

    if env == "production":
        return ProductionConfig()
    return DevelopmentConfig()


config = get_config()
