from pydantic_settings import BaseSettings


class Config(BaseSettings): ...


class ProductionConfig(Config):
    DEVELOPMENT: bool = False
    DEBUG: bool = False
    ENV: str = "production"


class DevelopmentConfig(Config):
    DEVELOPMENT: bool = True
    DEBUG: bool = True
    ENV: str = "debug"
