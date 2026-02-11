import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from routers import music, shows, football, auth_route, tasks, books, diary
from starlette.middleware.sessions import SessionMiddleware
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SESSION_SECRET_KEY"),
    same_site="lax",      
    https_only=False,
    max_age=3600 
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
    expose_headers=["*"],

)

app.include_router(music.router)
app.include_router(shows.router)
app.include_router(football.router)
app.include_router(auth_route.router)
app.include_router(tasks.router)
app.include_router(books.router)
app.include_router(diary.router)

if __name__ == "__main__":
	uvicorn.run("main:app", host="::", reload=True, port=8080)
