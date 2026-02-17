from uuid import UUID
from auth.auth import get_current_user_id
from queries import music
from models import Tracks
from fastapi import APIRouter, HTTPException, Query, Request, Response
from services.spotiapi import find_artist, find_music
import httpx

router = APIRouter(prefix='/music', tags=["Music"])

@router.get('/music_search')
def music_search(track_name: str):
    track = find_music(track_name)
    if not track:
        raise HTTPException(
            status_code=404,
            detail=f"Track with name '{track_name}' not found"
        )
    return track

@router.get('/artist_search')
def artist_search(artist_name: str):
    return find_artist(artist_name)

@router.get('/get_tracks')
def get_tracks(year: int, request: Request):
    user_id = get_current_user_id(request)
    return music.select_tracks(year, user_id)

@router.post('/add_track')
def add_track(request: Request, track: Tracks, year: int = Query(...)):
    user_id = get_current_user_id(request)
    try:
        return music.insert_track(track, year, user_id)
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))

@router.post("/swap_track_rank")
def swap_rank(track_id: UUID, direction: str):
    try:
        return music.swap_track_rank(track_id, direction)
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))


@router.post('/delete_track')
def delete(track_id: UUID):
    return music.delete_track(track_id)
