from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from demo_db import get_db
from sqlalchemy import text
from pydantic import BaseModel
from models import MovieBase, SeriesBase

router = APIRouter(prefix='/shows', tags=["Shows"])

@router.get('/movie_search')
def movie_search(movie_name: str):
    return {
        "id": 1,
        "title": "Inception",
        "original_title": "Inception",
        "tagline": "Your mind is the scene of the crime",
        "genre": "Sci-Fi, Action",
        "description": "A thief who steals corporate secrets through dream-sharing technology",
        "release_date": "2010-07-16",
        "country": "USA",
        "rating": 8.8,
        "image": "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg"
    }

@router.get('/get_movies')
def get_movies(year: int, db: Session = Depends(get_db)):
    result = db.execute(text("""
        SELECT m.*, um.personal_rating, um.addition_date 
        FROM user_movies um 
        JOIN movies m ON um.movie_id = m.id
        WHERE um.user_id = 'demo-user-id' AND um.year = :year
    """), {"year": year}).fetchall()
    
    user_movies = []
    for row in result:
        user_movies.append({
            "id": row[0],
            "title": row[1],
            "original_title": row[2],
            "tagline": row[3],
            "genre": row[4],
            "description": row[5],
            "release_date": row[6],
            "country": row[7],
            "rating": row[8],
            "image": row[9],
            "personal_rating": row[10],
            "addition_date": row[11]
        })
    return user_movies

class MovieAdd(BaseModel):
    data: MovieBase
    personal_rating: float
    
class SeriesAdd(BaseModel):
    data: SeriesBase
    personal_rating: float

@router.post('/add_movie')
def add_movie(payload: MovieAdd, db: Session = Depends(get_db)):
    return {
        "message": "Фильм успешно добавлен",
        "movie": {
            "id": "new-demo-movie",
            "title": payload.data.title,
            "genre": payload.data.genre,
            "rating": payload.personal_rating
        }
    }

@router.post('/delete_movie')
def delete_m(movie_id: str):
    return {"message": f"Фильм {movie_id} удален"}

@router.get('/series_search')
def series_search(series_name: str, season: int):
    return {
        "id": 1,
        "title": "Breaking Bad",
        "original_title": "Breaking Bad",
        "tagline": "Change the equation",
        "genre": "Crime, Drama",
        "description": "A high school chemistry teacher turned meth maker",
        "release_date": "2008-01-20",
        "country": "USA",
        "rating": 9.5,
        "image": "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
        "season_number": season,
        "episodes_count": 7,
        "season_overview": f"Season {season} of {series_name}",
        "season_poster": "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg"
    }

@router.get('/get_series')
def get_series(year: int, db: Session = Depends(get_db)):
    result = db.execute(text("""
        SELECT s.*, se.season_number, se.episodes_count, us.personal_rating, us.addition_date 
        FROM user_series us 
        JOIN seasons se ON us.season_id = se.id
        JOIN series s ON se.series_id = s.id
        WHERE us.user_id = 'demo-user-id' AND us.year = :year
    """), {"year": year}).fetchall()
    
    user_series = []
    for row in result:
        user_series.append({
            "id": row[0],
            "title": row[1],
            "original_title": row[2],
            "tagline": row[3],
            "genre": row[4],
            "description": row[5],
            "release_date": row[6],
            "country": row[7],
            "rating": row[8],
            "image": row[9],
            "season_number": row[10],
            "episodes_count": row[11],
            "personal_rating": row[12],
            "addition_date": row[13]
        })
    return user_series

@router.post('/add_series')
def add_series(payload: SeriesAdd, db: Session = Depends(get_db)):
    return {
        "message": "Сериал успешно добавлен",
        "series": {
            "id": "new-demo-series",
            "title": payload.data.title,
            "genre": payload.data.genre,
            "rating": payload.personal_rating
        }
    }

@router.post('/delete_series')
def delete_s(series_id: str):
    return {"message": f"Сериал {series_id} удален"}

@router.post('/update_rating')
def update_r(rating: float, id: str, type: str):
    return {"message": f"Рейтинг {type} {id} обновлен до {rating}"}

@router.get('/stats')
async def get_shows_stats(db: Session = Depends(get_db)):
    return {
        "total_movies": 3,
        "total_series": 2,
        "average_movie_rating": 8.8,
        "average_series_rating": 9.1,
        "recently_added": 1
    }
