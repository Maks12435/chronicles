from datetime import datetime, timedelta, timezone
import os
from fastapi import HTTPException, Request
from sqlalchemy import exists, select
from models import User, UsersTable
from db import session_factory
from passlib.context import CryptContext
from jose import JWTError, jwt

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("SESSION_SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 120
REFRESH_TOKEN_EXPIRE_DAYS = 7

def user_insert(user: User):
    with session_factory() as session:
        
        existing_user = session.query(UsersTable).filter(
            (UsersTable.username == user.username) | (UsersTable.email == user.email)
        ).first()

        if existing_user:
            if existing_user.username == user.username:
                raise HTTPException(status_code=409, detail="User with this name already exists")
            if existing_user.email == user.email:
                raise HTTPException(status_code=409, detail="User with this email already exists")
        
        hashed_password=pwd_context.hash(user.password)
        new_user = UsersTable(username=user.username, email=user.email, password=hashed_password)
        session.add(new_user)
        session.commit()
        session.refresh(new_user)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({'exp': int(expire.timestamp())})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS))
    to_encode.update({'exp': int(expire.timestamp()), 'type': 'refresh'})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def refresh_access_token(request, response):
    refresh_token = request.cookies.get('refresh_token')
    if not refresh_token:
        raise HTTPException(status_code=401, detail='No refresh token')
    
    try:
        pyload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        if pyload.get('type') != 'refresh':
            raise HTTPException(status_code=401, detail='Invalid token type')
        if pyload.get('exp') < datetime.now(timezone.utc).timestamp():
            raise HTTPException(status_code=401, detail='Refresh token has expired')
        
        user_id = pyload.get('sub')
        new_access_token = create_access_token({"sub": user_id})
        
        response.set_cookie(
            key="access_token",
            value=new_access_token,
            httponly=True,
            secure=False,
            samesite="lax",
            path="/",
            max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )
        
        return {"message": "Access token refreshed"}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
            
    
def user_login(user: User, response):
    with session_factory() as session:
        db_user = session.query(UsersTable).filter(UsersTable.email == user.email).first()
        
        if not db_user or not verify_password(user.password, db_user.password):
            raise HTTPException(status_code=401, detail="User with this email or password do not exists")

        token = create_access_token({'sub': str(db_user.id)})
        refresh_token = create_refresh_token({'sub': str(db_user.id)})
        
        response.set_cookie(
            key="access_token",
            value=token,
            httponly=True,  
            secure=False,       
            samesite="lax",
            path="/",
            max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60         
        )
        
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=False,
            samesite="lax",
            path="/",
            max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
        )
        
        return {"message": "token created", "user": {"email": db_user.email, "username": db_user.username}}
    
def select_user(user_id):
    with session_factory() as session:
        stmt = select(UsersTable.email, UsersTable.username).where(UsersTable.id == user_id)
        row = session.execute(stmt).one_or_none()
        if row:
            return {"email": row.email, "username": row.username}
        return None

def get_current_user_id(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
  
def token_check(request):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail='Not Authorized')
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get('exp') < datetime.now(timezone.utc).timestamp():
            raise HTTPException(status_code=401, detail='Token expired')
        return select_user(payload.get('sub'))
    except JWTError:
        raise HTTPException(status_code=401, detail='Invalid token')

def update_password(prev_pass, new_pass, request, response):
    user_id = get_current_user_id(request)
    
    with session_factory() as session:
        user = session.query(UsersTable).filter(UsersTable.id == user_id).first()
        
        if not pwd_context.verify(prev_pass, user.password):
            raise HTTPException(status_code=400, detail="Incorrect previous password")
        
        user.password = pwd_context.hash(new_pass)
        session.commit()
    
    return {"Password successfully changed"}

def delete_account(request):
    user_id = get_current_user_id(request)
    
    with session_factory() as session:
        account = session.get(UsersTable, user_id)
        if account:
            session.delete(account)
            session.commit()
            return {"message": "account deleted"}
        else:
            return {"error": "account not found"}
        
def find_or_create_oauth_user(email, oauth_id, username, provider):
    with session_factory() as session:
        user = session.query(UsersTable).filter(
            (UsersTable.email == email) | 
            ((UsersTable.oauth_id == oauth_id) & (UsersTable.oauth_provider == provider))
        ).first()
        
        if user:
            return user
        
        new_user = UsersTable(
            username=username,
            email=email,
            password=None,
            oauth_provider=provider,
            oauth_id=oauth_id
        )
        session.add(new_user)
        session.commit()
        session.refresh(new_user)
		
        return new_user
