from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from routers import music, shows, football, auth_route

app = FastAPI()
app.include_router(music.router)
app.include_router(shows.router)
app.include_router(football.router)
app.include_router(auth_route.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
    expose_headers=["*"],
)

if __name__ == "__main__":
    uvicorn.run("main:app", reload=True, port=8080)
