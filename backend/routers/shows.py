from queries import orm
from models import MovieBase, SeriesBase
from fastapi import APIRouter, HTTPException, Query
from services.movieapi import find_movie, find_tv_show

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
def get_movies(year: int):
    return orm.select_movies(year)

@router.post('/add_movie')
def add_movie(data: MovieBase):
    try:
        return orm.insert_movie(data)
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))

@router.post('/delete_movie')
def delete_m(movie_id: int):
    return orm.delete_movie(movie_id)

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
def get_series(year: int):
    return orm.select_series(year)

@router.post('/add_series')
def add_series(data: SeriesBase):
    try:
        return orm.insert_series(data)
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))

@router.post('/delete_series')
def delete_s(series_id: int):
    return orm.delete_series(series_id)



@router.post('/update_rating')
def update_r(rating: float, id: int, type: str):
    return orm.update_rating(rating, id, type)