from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from api.config import config

database_url = config.DATABASE_URL

if database_url:
    engine = create_engine(database_url)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
