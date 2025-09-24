from datetime import datetime, timedelta, timezone
from fastapi import HTTPException
from sqlalchemy import exists, select
from models import User, UsersTable
from db import session_factory
from passlib.context import CryptContext
from jose import JWTError, jwt

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = "supersecretkey"   
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 90

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
    
def user_login(user: User, response):
    with session_factory() as session:
        db_user = session.query(UsersTable).filter(UsersTable.email == user.email).first()
        
        if not db_user:
            raise HTTPException(status_code=401, detail="User with this email or password do not exists")
            
        if not verify_password(user.password, db_user.password):
            raise HTTPException(status_code=401, detail="User with this email or password do not exists")

        token = create_access_token({'sub': str(db_user.id)})
        
        response.set_cookie(
            key="access_token",
            value=token,
            httponly=True,  
            secure=False,       
            samesite="lax",  
            max_age=3600         
        )
        
        return {"token created"}
    
def select_user(user_id):
    with session_factory() as session:
        stmt = select(UsersTable.email, UsersTable.username).where(UsersTable.id == user_id)
        row = session.execute(stmt).one_or_none()
        if row:
            return {"email": row.email, "username": row.username}
        return None

  
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
