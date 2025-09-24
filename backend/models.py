from datetime import date
from typing import Optional
from pydantic import BaseModel
from db import Base
from sqlalchemy import String, Integer, Column, CheckConstraint, Text, Numeric, Date, UniqueConstraint, Computed, Float, ForeignKey, text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
import uuid

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

class SeriesBase(BaseModel):
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
    season_number: int
    episodes_count: int
    season_overview: str
    season_poster: str

    class Config:
        from_attributes = True



class MovieCreate(MovieBase):
    pass

class Movie(MovieBase):
    id: int

    class Config:
        from_attributes = True
        
class User(BaseModel):
    username: Optional[str] = None
    email: str
    password: str





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

class MatchesTable(Base):
    __tablename__ = 'matches'

    id: Mapped[int] = mapped_column(primary_key=True)
    team1_id: Mapped[int] = mapped_column(ForeignKey('teams.id'), nullable=False)
    team2_id: Mapped[int] = mapped_column(ForeignKey('teams.id'), nullable=False)
    score: Mapped[str] = mapped_column(String, nullable=False)
    stadium_id: Mapped[int] = mapped_column(ForeignKey('stadiums.id'), nullable=False)
    match_date: Mapped[Date] = mapped_column(Date, nullable=False)
    tournament_id: Mapped[int] = mapped_column(ForeignKey('tournaments.id'), nullable=False)
    stage: Mapped[str] = mapped_column(String, nullable=False)
    image: Mapped[str] = mapped_column(String)
    team1_xg: Mapped[float] = mapped_column(Float, default=0.0)
    team2_xg: Mapped[float] = mapped_column(Float, default=0.0)
    team1_shots: Mapped[int] = mapped_column(Integer, default=0)
    team2_shots: Mapped[int] = mapped_column(Integer, default=0)
    team1_shots_on_target: Mapped[int] = mapped_column(Integer, default=0)
    team2_shots_on_target: Mapped[int] = mapped_column(Integer, default=0)
    team1_possession: Mapped[int] = mapped_column(Integer, default=0)
    team2_possession: Mapped[int] = mapped_column(Integer, default=0)

class GoalsTable(Base):
    __tablename__ = 'goals'

    id = Column(Integer, primary_key=True, autoincrement=True)
    match_id = Column(Integer, ForeignKey('matches.id'), nullable=False)
    scorer = Column(String)
    minute = Column(Integer)
    team_id = Column(Integer, ForeignKey('teams.id'), nullable=False)

class TournamentsTable(Base):
    __tablename__ = 'tournaments'

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    type: Mapped[str] = mapped_column(String(50), nullable=False) 
    country_id: Mapped[int | None] = mapped_column(ForeignKey('countries.id', ondelete='SET NULL'), nullable=True)

class TeamsTable(Base):
    __tablename__ = 'teams'

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    type: Mapped[str] = mapped_column(String(20), nullable=False)  
    country_id: Mapped[int | None] = mapped_column(ForeignKey('countries.id', ondelete='SET NULL'), nullable=True)
    logo: Mapped[str | None] = mapped_column(Text, nullable=True)

class StadiumsTable(Base):
    __tablename__ = 'stadiums'

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    team_id: Mapped[int] = mapped_column(ForeignKey('teams.id', ondelete='CASCADE'), nullable=False)




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
    year = Column(Integer, server_default=text("EXTRACT(YEAR FROM CURRENT_DATE)")) 

class SeriesTable(Base):
    __tablename__ = 'series'

    id = Column(Integer, primary_key=True)
    title = Column(Text)
    original_title = Column(Text)
    tagline = Column(Text, nullable=True)
    genre = Column(String)
    description = Column(Text)
    release_date = Column(Date)
    country = Column(String(10))
    rating = Column(Float)
    personal_rating = Column(Float, nullable=True)
    image = Column(Text)
    season_number = Column(Integer)
    episodes_count = Column(Integer)
    season_overview = Column(Text)
    season_poster = Column(Text)
    year = Column(Integer, server_default=text("EXTRACT(YEAR FROM CURRENT_DATE)"))

class UsersTable(Base):
    __tablename__ = 'users'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)