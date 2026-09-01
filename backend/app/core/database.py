from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

from app.core.config import settings

# PostgreSQL Engine
engine = create_engine(
    settings.DATABASE_URL,
    echo=True,          # Show SQL queries during development
    future=True,
)

# Database Session
SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
)

# Base class for all SQLAlchemy models
class Base(DeclarativeBase):
    pass


# Dependency for FastAPI routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()