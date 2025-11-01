from authlib.integrations.starlette_client import OAuth
from fastapi import Request
import os

oauth = OAuth()

oauth.register(
    name='google',
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'},
    api_base_url='https://www.googleapis.com/oauth2/v3/'
)

async def get_google_user(request: Request):
    try:
        token = await oauth.google.authorize_access_token(request)
        
        resp = await oauth.google.get("userinfo", token=token)
        user_info = resp.json()
        
        return user_info
    except Exception as e:
        print(f"OAuth error: {e}")
        if 'token' in locals():
            print(f"Token type: {type(token)}")
            if hasattr(token, 'keys'):
                print(f"Token keys: {list(token.keys())}")
            else:
                print(f"Token: {token}")
        raise
