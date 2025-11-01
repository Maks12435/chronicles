import os
from fastapi import APIRouter, Request, Response
from models import ChangePasswordModel, User
from fastapi.responses import RedirectResponse
from auth.oauth import get_google_user, oauth
from auth import auth

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
    
@router.post('/refresh')
def refresh_token(request: Request, response: Response):
    return auth.refresh_access_token(request, response)

@router.post('/change_password')
async def change_password(data: ChangePasswordModel, request: Request, response: Response): 
    return auth.update_password(data.prevPass, data.newPass, request, response)

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return {"message": "Logged out successfully"}

@router.post("/delete_account")
def delete(request: Request, response: Response):
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return auth.delete_account(request)

@router.get("/login/google")
async def google_login(request: Request):
    redirect_uri = os.getenv("REDIRECT_URI")
    return await oauth.google.authorize_redirect(request, redirect_uri, access_type="offline", prompt="consent")


@router.get("/login/google/callback")
async def google_callback(request: Request, response: Response):
    user_info = await get_google_user(request)
    email = user_info.get("email")
    google_id = user_info.get("sub")
    username = user_info.get("name")

    user = auth.find_or_create_oauth_user(email, google_id, username, "google")
    
    token = auth.create_access_token({'sub': str(user.id)})
    refresh_token = auth.create_refresh_token({'sub': str(user.id)})

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=15 * 60,
        path="/"
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=7 * 24 * 60 * 60,
        path="/"
    )

    print(f"OAuth callback: Set cookies for user {user.id}")
    print(f"Access token: {token[:20]}...")
    print(f"Refresh token: {refresh_token[:20]}...")

    return RedirectResponse(url="http://localhost:5173/")
