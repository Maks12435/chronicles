from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from demo_db import get_db
from sqlalchemy import text

router = APIRouter(prefix='/music', tags=["Music"])

@router.post('/music_search')
def music_search(track_name: str):
    return {
        "id": "demo-track-1",
        "title": "Blinding Lights",
        "artist": "The Weeknd",
        "album": "After Hours",
        "genre": "Pop",
        "duration": "3:20",
        "small_image": "https://i.scdn.co/image/ab67616d00004851e2d156fdc691f57900134342",
        "mid_image": "https://i.scdn.co/image/ab67616d00001e02e2d156fdc691f57900134342",
        "big_image": "https://i.scdn.co/image/ab67616d0000b273e2d156fdc691f57900134342"
    }

@router.post('/artist_search')
def artist_search(artist_name: str):
    return {
        "id": "demo-artist-1",
        "name": "The Weeknd",
        "image": "https://i.scdn.co/image/ab67616d00001e02e2d156fdc691f57900134342",
        "genres": ["Pop", "R&B"],
        "popularity": 90
    }

@router.get('/get_tracks')
def get_tracks(year: int, db: Session = Depends(get_db)):
    result = db.execute(text("""
        SELECT t.*, ut.rank, ut.addition_date 
        FROM user_tracks ut 
        JOIN tracks t ON ut.track_id = t.id
        WHERE ut.user_id = 'demo-user-id' AND ut.year = :year
    """), {"year": year}).fetchall()
    
    user_tracks = []
    for row in result:
        user_tracks.append({
            "id": row[0],
            "title": row[1],
            "artist": row[2],
            "album": row[3],
            "genre": row[4],
            "duration": row[5],
            "small_image": row[6],
            "mid_image": row[7],
            "big_image": row[8],
            "rank": row[9],
            "addition_date": row[10]
        })
    return user_tracks

@router.post('/add_track')
def add_track(track: dict, year: int = Query(...), db: Session = Depends(get_db)):
    return {
        "message": "Трек успешно добавлен",
        "track": {
            "id": "new-demo-track",
            "title": track.get("title", "Новый трек"),
            "artist": track.get("artist", "Исполнитель"),
            "album": track.get("album", "Альбом"),
            "genre": track.get("genre", "Жанр"),
            "duration": track.get("duration", "3:00")
        }
    }

@router.post("/swap_track_rank")
def swap_rank(track_id: str, direction: str):
    return {"message": f"Рейтинг трека {track_id} изменен в направлении {direction}"}

@router.post('/delete_track')
def delete(track_id: str):
    return {"message": f"Трек {track_id} удален"}

@router.get('/stats')
async def get_music_stats(db: Session = Depends(get_db)):
    return {
        "total_tracks": 3,
        "top_artist": "The Weeknd",
        "top_genre": "Pop",
        "recently_added": 1
    }
