from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database_layer.base import Base

DATABASE_URL = "sqlite:///./resumes.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_tables():
    from database_layer import models
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
