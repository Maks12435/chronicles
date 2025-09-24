from fastapi import APIRouter, HTTPException, Request, Response
from models import User
from queries import auth

router = APIRouter(prefix='/auth', tags=["Auth"])

@router.post('/register')
def user_register(user: User):
    return auth.user_insert(user)
 
    
@router.post('/login')
def user_login(user: User, response: Response):
    return auth.user_login(user, response)

@router.get('/check')
def auth_check(request: Request):
    return auth.token_check(request)
    