import os
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from starlette.middleware.sessions import SessionMiddleware
from dotenv import load_dotenv
from sqlalchemy.orm import Session

from demo_routers import demo_auth_route, demo_music, demo_shows, demo_books, demo_tasks, demo_diary
from demo_db import get_db, init_demo_db

load_dotenv()

app = FastAPI(title="Chronicles Demo", description="Демо-версия приложения Chronicles")

app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SESSION_SECRET_KEY", "demo-secret-key"),
    same_site="lax",      
    https_only=False,
    max_age=3600 
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
    expose_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    init_demo_db()

app.include_router(demo_auth_route.router)
app.include_router(demo_music.router)
app.include_router(demo_shows.router)
app.include_router(demo_books.router)
app.include_router(demo_tasks.router)
app.include_router(demo_diary.router)

@app.get("/")
async def root():
    return {
        "message": "Добро пожаловать в Chronicles Demo!",
        "demo_user": {"username": "demo", "password": "demo123"},
        "endpoints": {
            "auth": "/auth/login",
            "music": "/music/tracks",
            "shows": "/shows/movies",
            "books": "/books/list",
            "tasks": "/tasks/list",
            "diary": "/diary/records"
        }
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "mode": "demo"}

if __name__ == "__main__":
    uvicorn.run("demo_main:app", host="0.0.0.0", reload=True, port=8080)
