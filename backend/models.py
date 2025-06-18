from typing import Optional
from pydantic import BaseModel
from db import Base
from sqlalchemy import String, Integer, Column, CheckConstraint

class Tracks(BaseModel):
    title: str
    artist: str
    album: str
    genre: str
    date: str
    duration: str  
    image: str

class TracksTable(Base):
    __tablename__ = 'tracks'

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String)
    artist = Column(String)
    album = Column(String)
    genre = Column(String)
    date = Column(String)
    duration = Column(String)  
    image = Column(String)
    rank = Column(Integer, unique=True)

    __table_args__ = (
        CheckConstraint('rank BETWEEN 1 AND 20', name='rank_between_1_20'),
    )
