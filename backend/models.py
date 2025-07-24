from datetime import date
from typing import Optional
from pydantic import BaseModel
from db import Base
from sqlalchemy import String, Integer, Column, CheckConstraint, Text, Numeric, Date, UniqueConstraint, Computed

class Tracks(BaseModel):
    title: str
    artist: str
    album: str
    genre: str
    date: date
    duration: str  
    image: str

class MovieBase(BaseModel):
    title: str
    original_title: str
    tagline: Optional[str] = None
    genre: str
    description: Optional[str] = None
    release_date: Optional[date] = None
    country: Optional[str] = None
    rating: Optional[float] = None
    personal_rating: Optional[float] = None
    image: Optional[str] = None

    class Config:
        from_attributes = True

class MovieCreate(MovieBase):
    pass

class Movie(MovieBase):
    id: int

    class Config:
        from_attributes = True
        

class TracksTable(Base):
    __tablename__ = 'tracks'

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String)
    artist = Column(String)
    album = Column(String)
    genre = Column(String)
    date = Column(Date)
    duration = Column(String)  
    image = Column(String)
    rank = Column(Integer)  
    year = Column(Integer, Computed("EXTRACT(YEAR FROM date) STORED")) 


    __table_args__ = (
        UniqueConstraint('rank', 'year', name='unique_rank_per_year'),
        CheckConstraint('(rank BETWEEN 1 AND 30) OR rank = -1', name='tracks_rank_check'),
    )

class FootballTable(Base):
    __tablename__ = 'football'

    id = Column(Integer, primary_key=True, autoincrement=True)
    team1 = Column(String(30), nullable=False)
    team2 = Column(String(30), nullable=False)
    score = Column(String(10), nullable=True)
    stadium = Column(String(60), nullable=True)
    date = Column(Date, nullable=True)
    tournament = Column(String(100), nullable=True)
    image = Column(Text, nullable=True)
    stage = Column(String(20), nullable=True)

class TeamsTable(Base):
    __tablename__ = 'teams'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(30), nullable=False)
    logo = Column(Text, nullable=False)

class MovieTable(Base):
    __tablename__ = "movies"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    original_title = Column(String(100))
    tagline = Column(Text)
    genre = Column(String(20))
    description = Column(Text)
    release_date = Column(Date)
    country = Column(String(50))
    rating = Column(Numeric)
    personal_rating = Column(Numeric)
    image = Column(Text)
