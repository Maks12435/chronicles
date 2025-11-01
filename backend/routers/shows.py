from uuid import UUID

from pydantic import BaseModel
from queries import shows
from models import MovieBase, SeriesBase
from fastapi import APIRouter, HTTPException, Query, Request
from services.movieapi import find_movie, find_tv_show
from auth.auth import get_current_user_id

router = APIRouter(prefix='/shows', tags=["Shows"])

@router.get('/movie_search')
def movie_search(movie_name: str):
    movie = find_movie(movie_name=movie_name)
    if not movie:
        raise HTTPException(
            status_code=404,
            detail=f"Movie with title '{movie_name}' not found"
        )
    return movie
    

@router.get('/get_movies')
def get_movies(year: int, request: Request):
    user_id = get_current_user_id(request)
    return shows.select_movies(year, user_id)

class MovieAdd(BaseModel):
    data: MovieBase
    personal_rating: float
    
class SeriesAdd(BaseModel):
    data: SeriesBase
    personal_rating: float

@router.post('/add_movie')
def add_movie(request: Request, payload: MovieAdd):
    user_id = get_current_user_id(request)
    try:
        return shows.insert_movie(payload.data, payload.personal_rating, user_id)
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))

@router.post('/delete_movie')
def delete_m(movie_id: UUID):
    return shows.delete_movie(movie_id)

@router.get('/series_search')
def series_search(series_name: str, season: int):
    tv_show = find_tv_show(tv_name=series_name, season=season)
    if not tv_show:
        raise HTTPException(
            status_code=404, 
            detail=f"Series with title'{series_name}' (season {season}) not found"
        )
    return tv_show

@router.get('/get_series')
def get_series(year: int, request: Request):
    user_id = get_current_user_id(request)
    return shows.select_series(year, user_id)

@router.post('/add_series')
def add_series(request: Request, payload: SeriesAdd):
    user_id = get_current_user_id(request)
    try:
        return shows.insert_series(payload.data, payload.personal_rating, user_id)
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))

@router.post('/delete_series')
def delete_s(series_id: UUID):
    return shows.delete_series(series_id)

@router.post('/update_rating')
def update_r(rating: float, id: UUID, type: str):
    return shows.update_rating(rating, id, type)
