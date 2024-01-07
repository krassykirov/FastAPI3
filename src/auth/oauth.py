from fastapi.security import OAuth2PasswordRequestForm
from fastapi import APIRouter, Depends, Request
from starlette.datastructures import URL
from typing import Union
from sqlmodel import Session, select
from starlette import status
from fastapi import Depends, HTTPException, APIRouter, Request, Response
from fastapi.responses import RedirectResponse
from fastapi.templating import Jinja2Templates
from src.db import get_session
import src.models
from jose import JWTError, jwt, ExpiredSignatureError
from fastapi import BackgroundTasks
from datetime import datetime, timedelta
from src.auth.oauth_schemas import OAuth2PasswordBearerCookie
from passlib.context import CryptContext
import datetime
from src.my_logger import detailed_logger

logger = detailed_logger()

pwd_context = CryptContext(schemes="bcrypt")

templates = Jinja2Templates(directory="src/static/templates")
oauth_router = APIRouter()

oauth2_scheme = OAuth2PasswordBearerCookie(tokenUrl="/api/token")

ACCESS_TOKEN_EXPIRE_MINUTES = 360
ALGORITHM = "HS256"
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"


@oauth_router.get("/", include_in_schema=False)
def home(request: Request):
    # print("headers:", request.headers.get('cookie').split("=")[1].split()[1].replace('"',""))
    try:
        token = request.cookies.get("access_token") #or request.headers.get("access_token")
        if token:
            access_token = token.split()[1]
            payload = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
            username = payload.get("sub")
            expires = payload.get("exp")
            converted_expires = datetime.datetime.fromtimestamp(expires)
            if datetime.datetime.now() < converted_expires:
                context = {'request': request, 'current_user': username, 'access_token': access_token, 'expires': converted_expires}
                redirect_url = request.url_for('get_products')
                response = RedirectResponse(redirect_url, status_code=status.HTTP_303_SEE_OTHER)
                return response
                # return templates.TemplateResponse("base.html",{"request":request, 'current_user': username})
        else:
            context = {'request': request}
            return templates.TemplateResponse("login.html", context)
    except ExpiredSignatureError:
        context = {'request': request, 'message': "Session expired please login"}
        return templates.TemplateResponse("login.html", context)
    except Exception:
        raise

def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.datetime.utcnow() + expires_delta
    else:
        expire = datetime.datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(request: Request, token: str = Depends(oauth2_scheme), db: Session = Depends(get_session)):
    credentials_exception = HTTPException(status_code=302, detail="Not authorized", headers = {"Location": "/login"} )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        expires = payload.get("exp")
        if username is None:
            raise credentials_exception
        token_data = src.models.TokenData(username=username, expires=expires)
    except JWTError:
        raise credentials_exception
    query = select(src.models.User).where(src.models.User.username == token_data.username)
    user = db.exec(query).first()
    if user is None:
        raise credentials_exception
    if expires is None:
        raise credentials_exception
    converted_expires = datetime.datetime.fromtimestamp(expires)
    if datetime.datetime.utcnow() > converted_expires:
        response = templates.TemplateResponse("login.html",{"request":request, 'message': "Session expired"})
        return response
    return user

@oauth_router.post('/token', include_in_schema=False)
def login_access_token(*, request: Request, response: Response, form_data: OAuth2PasswordRequestForm=Depends(),
                db: Session = Depends(get_session), background_tasks: BackgroundTasks ):
    query = select(src.models.User).where(src.models.User.username == form_data.username)
    user = db.exec(query).first()
    if user and user.verify_password(form_data.password):
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )
        response = RedirectResponse(url='/', status_code=status.HTTP_303_SEE_OTHER)
        response.set_cookie(key="access_token", value=f"Bearer {access_token}", httponly=True)
        response.headers["Authorization"] = f"Bearer {access_token}"
        return response

    else:
        context = {'request': request, 'message': "Username or password are incorrect!"}
        return templates.TemplateResponse("login.html", context)

@oauth_router.post('/api/token', include_in_schema=True)
def login_access_token(*, request: Request, response: Response, form_data: OAuth2PasswordRequestForm=Depends(),
                db: Session = Depends(get_session), background_tasks: BackgroundTasks ):
    query = select(src.models.User).where(src.models.User.username == form_data.username)
    user = db.exec(query).first()
    if user and user.verify_password(form_data.password):
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
    else:
        return {'message': "Username or password are incorrect!"}

@oauth_router.get("/login", include_in_schema=False)
def login(request: Request):
    response = templates.TemplateResponse("login.html",{"request":request})
    return response

@oauth_router.post("/signup", include_in_schema=False)
async def signup(request: Request, db: Session = Depends(get_session)):
    form_data = await request.form()
    username = form_data.get('username')
    passwd = form_data.get('password')
    passwd2 = form_data.get('password2')
    assert passwd == passwd2
    query = select(src.models.User).where(src.models.User.username == username)
    user = db.exec(query).first()
    if user:
        logger.error(f"Item with that name already exists!")
        raise HTTPException(status_code=403,detail=f"User with that email address already exists!")
    user = src.models.User(username=username)
    user.set_password(passwd)
    db.add(user)
    db.commit()
    response = templates.TemplateResponse("login.html",{"request":request})
    return response

@oauth_router.get("/signup", include_in_schema=False)
def login(request: Request):
    print("entering signup get")
    response = templates.TemplateResponse("signup.html",{"request":request})
    return response

@oauth_router.get("/logout", include_in_schema=False)
def logout(request: Request):
    response = RedirectResponse("login.html", status_code=302)
    response = templates.TemplateResponse("login.html",{"request":request, 'current_user': None})
    response.delete_cookie(key="access_token")
    return response
