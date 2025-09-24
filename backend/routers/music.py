from queries import orm
from models import Tracks
from fastapi import APIRouter, HTTPException, Query
from services.spotiapi import find_artist, find_music

router = APIRouter(prefix='/music', tags=["Music"])

@router.post('/music_search')
def music_search(track_name: str):
    track = find_music(track_name)
    if not track:
        raise HTTPException(
            status_code=404,
            detail=f"Track with name '{track_name}' not found"
        )
    return track

@router.post('/artist_search')
def artist_search(artist_name: str):
    return find_artist(artist_name)

@router.get('/get_tracks')
def get_tracks(year: int):
    return orm.select_tracks(year)

@router.get('/get_genres')
def get_genres(year: int):
    return orm.select_genres(year)

@router.get('/get_artists')
def get_artists(year: int):
    return orm.select_artists(year)

@router.post('/add_track')
def add_track(track: Tracks, year: int = Query(...)):
    try:
        return orm.insert_track(track, year)
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))

@router.post("/swap_rank_next")
def swap_track_rank(track_id: int):
    try:
        return orm.swap_with_next_rank(track_id)
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))

@router.post("/swap_rank_previous")
def swap_track_rank(track_id: int):
    try:
        return orm.swap_with_previous_rank(track_id)
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))

@router.post('/delete_track')
def delete(track_id: int):
    return orm.delete_track(track_id)
