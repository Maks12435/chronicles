from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.spotiapi import find_music
import uvicorn

app = FastAPI()

@app.post('/music_search')
def music_search(track_name: str):
    return find_music(track_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)


if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)