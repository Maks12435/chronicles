from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
import os

engine = create_engine('sqlite:///demo_chronicles.db', echo=False)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_demo_db():
    if not os.path.exists('demo_chronicles.db'):
        print("Создание демо-базы")
        from demo_data import init_demo_database
        init_demo_database()
    else:
        print("Демо-база уже существует")
