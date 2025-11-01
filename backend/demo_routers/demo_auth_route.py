from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from demo_db import get_db
from models import User

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login")
async def login(user: User, db: Session = Depends(get_db)):
    if user.email == "demo@chronicles.com" and user.password == "demo1234":
        return {
            "message": "Успешный вход",
            "user": {
                "id": "demo-user-id",
                "username": "demo",
                "email": "demo@chronicles.com"
            },
            "access_token": "demo-access-token"
        }
    else:
        raise HTTPException(status_code=401, detail="Неверные учетные данные")

@router.post("/register")
async def register(user: User, db: Session = Depends(get_db)):
    return {
        "message": "Пользователь успешно зарегистрирован",
        "user": {
            "id": "demo-user-id",
            "username": user.username,
            "email": user.email
        },
        "access_token": "demo-access-token"
    }

@router.get("/me")
async def get_current_user():
    return {
        "id": "demo-user-id",
        "username": "demo",
        "email": "demo@chronicles.com"
    }

@router.get("/check")
async def check_auth():
    return {"status": "authenticated"}

@router.post("/logout")
async def logout():
    return {"message": "Успешный выход"}
