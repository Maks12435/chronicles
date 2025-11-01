from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field
from db import Base
from sqlalchemy import DateTime, String, Integer, Column, CheckConstraint, Text, Numeric, Date, UniqueConstraint, Computed, Float, ForeignKey, func, text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
import uuid

class Tracks(BaseModel):
    id: str
    title: str
    artist: str
    album: str
    genre: str
    duration: str  
    small_image: str
    mid_image: str
    big_image:str
    
class Books(BaseModel):
    title: str
    author: str
    isbn: Optional[str] = None
    released_year: Optional[str] = None    
    image: Optional[str] = None             
    personal_rating: Optional[float] = None   
    average_rating: Optional[float] = None    
    description: Optional[str] = None     
    language: Optional[str] = None
    country: Optional[str] = None
    price: Optional[str] = None
    web_reader_link: Optional[str] = None

class MovieBase(BaseModel):
    id: int
    title: str
    original_title: str
    tagline: Optional[str] = None
    genre: str
    description: Optional[str] = None
    release_date: Optional[date] = None
    country: Optional[str] = None
    rating: Optional[float] = None
    image: Optional[str] = None

    class Config:
        from_attributes = True

class SeriesBase(BaseModel):
    id: int
    title: str
    original_title: str
    tagline: Optional[str] = None
    genre: str
    description: Optional[str] = None
    release_date: Optional[date] = None
    country: Optional[str] = None
    rating: Optional[float] = None
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
    password: Optional[str] = Field(..., min_length=8) 
    oauth_provider: Optional[str]  = None
    oauth_id: Optional[str]  = None
    

class Task(BaseModel):
    title: str
    description: Optional[str] = None
    type: str
    difficulty: Optional[int] = 0
    status: Optional[str] = "in progress"
    created_time: Optional[datetime] = None
    finished_time: Optional[datetime] = None
    
    
class Diary(BaseModel):
    title: str
    description: str
    created_time: Optional[datetime] = None
    record_type: str

    class Config:
        from_attributes = True
        
class ChangePasswordModel(BaseModel):
    prevPass: str = Field(..., min_length=8)
    newPass: str = Field(..., min_length=8)
        
        










class TracksTable(Base):
    __tablename__ = 'tracks'

    id = Column(String, primary_key=True)
    title = Column(String)
    artist = Column(String)
    album = Column(String)
    genre = Column(String)
    duration = Column(String)  
    small_image = Column(String) 
    mid_image = Column(String) 
    big_image = Column(String) 

    
class UserTracksTable(Base):
    __tablename__ = 'user_tracks'

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[UUID] = mapped_column(ForeignKey('users.id'), nullable=False)
    track_id: Mapped[str] = mapped_column(ForeignKey('tracks.id'), nullable=False)
    addition_date: Mapped[Date] = mapped_column(Date, nullable=False, server_default=func.now())
    rank: Mapped[int] = mapped_column(Integer)
    year: Mapped[int] = mapped_column(Integer, Computed("EXTRACT(YEAR FROM addition_date) STORED"))
    
    __table_args__ = (
		UniqueConstraint('user_id', 'rank', 'year', name='unique_rank_per_user_per_year'),
		CheckConstraint('(rank BETWEEN 1 AND 30) OR rank = -1', name='tracks_rank_check'),
	)

class UserMoviesTable(Base):
    __tablename__ = 'user_movies'

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[UUID] = mapped_column(ForeignKey('users.id'), nullable=False)
    movie_id: Mapped[int] = mapped_column(ForeignKey('movies.id'), nullable=False)
    addition_date: Mapped[Date] = mapped_column(Date, nullable=False, server_default=func.now())
    personal_rating: Mapped[float] = mapped_column(Numeric, nullable=True)
    year: Mapped[int] = mapped_column(Integer, Computed("EXTRACT(YEAR FROM addition_date) STORED"))

class UserSeriesTable(Base):
    __tablename__ = 'user_series'

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[UUID] = mapped_column(ForeignKey('users.id'), nullable=False)
    season_id: Mapped[int] = mapped_column(ForeignKey('seasons.id', ondelete='CASCADE'), nullable=False)
    addition_date: Mapped[Date] = mapped_column(Date, nullable=False, server_default=func.now())
    personal_rating: Mapped[float] = mapped_column(Numeric, nullable=True)
    year: Mapped[int] = mapped_column(Integer, Computed("EXTRACT(YEAR FROM addition_date) STORED"))

class UserBooksTable(Base):
    __tablename__ = 'user_books'

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[UUID] = mapped_column(ForeignKey('users.id'), nullable=False)
    book_id: Mapped[int] = mapped_column(ForeignKey('books.id'), nullable=False)
    addition_date: Mapped[Date] = mapped_column(Date, nullable=False, server_default=func.now())
    personal_rating: Mapped[float] = mapped_column(Numeric, nullable=True)
    year: Mapped[int] = mapped_column(Integer, Computed("EXTRACT(YEAR FROM addition_date) STORED"))
    


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

    id = Column(Integer, primary_key=True)
    title = Column(String(100), nullable=False)
    original_title = Column(String(100))
    tagline = Column(Text)
    genre = Column(String(20))
    description = Column(Text)
    release_date = Column(Date)
    country = Column(String(50))
    rating = Column(Numeric)
    image = Column(Text)


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
    image = Column(Text)
    
class SeasonTable(Base):
    __tablename__ = "seasons"

    id = Column(Integer, primary_key=True, autoincrement=True)
    series_id = Column(Integer, ForeignKey("series.id", ondelete="CASCADE"), nullable=False)
    season_number = Column(Integer, nullable=False)
    episodes_count = Column(Integer)
    season_overview = Column(String)
    season_poster = Column(String)

    __table_args__ = (UniqueConstraint('series_id', 'season_number'),)


class UsersTable(Base):
    __tablename__ = 'users'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=True)  
    oauth_provider = Column(String, nullable=True)  
    oauth_id = Column(String, nullable=True)  
    
class TasksTable(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    type: Mapped[str] = mapped_column(String, nullable=False)
    difficulty: Mapped[int] = mapped_column(Integer, server_default=text("0"))
    status: Mapped[str] = mapped_column(String, server_default=text("'in progress'"))
    created_time: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    finished_time: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    user_id: Mapped[UUID] = mapped_column(ForeignKey('users.id'), nullable=False)

class BooksTable(Base):
    __tablename__ = 'books'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String, nullable=False)
    author: Mapped[str] = mapped_column(String, nullable=False)
    isbn: Mapped[str] = mapped_column(String)
    released_year: Mapped[int] = mapped_column(String)
    image: Mapped[str] = mapped_column(String)
    personal_rating: Mapped[float] = mapped_column(Numeric, nullable=True)
    average_rating: Mapped[float] = mapped_column(Numeric, nullable=True)
    description: Mapped[str] = mapped_column(String, nullable=True) 
    year: Mapped[int] = mapped_column(Integer, server_default=text("EXTRACT(YEAR FROM CURRENT_DATE)"))
    language: Mapped[str] = mapped_column(String, nullable=True)
    country: Mapped[str] = mapped_column(String, nullable=True)
    price: Mapped[str] = mapped_column(String, nullable=True)
    web_reader_link: Mapped[str] = mapped_column(String, nullable=True)

class DiaryTable(Base):
    __tablename__ = 'diary'
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=False)
    created_time: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    record_type: Mapped[str] = mapped_column(String, nullable=False)
    user_id: Mapped[UUID] = mapped_column(ForeignKey('users.id'), nullable=False)
