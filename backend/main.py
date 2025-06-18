from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.spotiapi import find_music
import uvicorn
from queries import orm
from models import Tracks

app = FastAPI()

@app.post('/music_search')
def music_search(track_name: str):
    return find_music(track_name)

@app.get('/get_tracks')
def get_tracks():
    return orm.select_tracks()

@app.get('/get_genres')
def get_genres():
    return orm.select_genres()

@app.get('/get_artists')
def get_artists():
    return orm.select_artists()

@app.post('/add_track')
def add_track(track: Tracks):
    return orm.insert_track(track)

@app.post('/delete_track')
def delete(track_id: int):
    return orm.delete_track(track_id)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)


if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)