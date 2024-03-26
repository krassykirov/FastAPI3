from fastapi import APIRouter, status
from fastapi.responses import JSONResponse
from fastapi import Request, Depends, HTTPException
from db import get_session
from crud.crud import ProfileActions
from sqlalchemy.orm import Session
from models import UserProfile, User
from sqlalchemy import select
from auth.oauth import get_current_user
from schemas import UserProfileUpdate
from fastapi.encoders import jsonable_encoder
from typing import List
from my_logger import detailed_logger
from pathlib import Path
import shutil, os
import schemas

PROJECT_ROOT = Path(__file__).parent.parent
BASE_DIR = Path(__file__).resolve().parent

PROTECTED = [Depends(get_current_user)]

profile_router = APIRouter(prefix='/api/profile', tags=["profile"], dependencies=PROTECTED,
                            responses={404: {"description": "Not found"}},)

logger = detailed_logger()

@profile_router.get("/", status_code=status.HTTP_200_OK, response_model=List[UserProfile], include_in_schema=True)
def get_profiles(db: Session = Depends(get_session)) -> List[UserProfile]:
    profiles = ProfileActions().get_profiles(db=db)
    if profiles is None:
        logger.info(f"No profiles found")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No profiles found")
    profiles = jsonable_encoder(profiles)
    return profiles

@profile_router.get("/{user_id}", status_code=status.HTTP_200_OK, response_model=UserProfile, include_in_schema=True)
def get_profile(user_id: int, db: Session = Depends(get_session), user: User = Depends(get_current_user)) -> UserProfile:
    profile = ProfileActions().get_profile_by_user_id(db=db, user_id=user_id)
    if profile is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No user profile found")
    return profile


@profile_router.post("/create_profile", status_code=status.HTTP_201_CREATED, include_in_schema=False)
@profile_router.post("/user/create_profile", status_code=status.HTTP_201_CREATED,  include_in_schema=False)
async def create_profile(request: Request, db: Session = Depends(get_session), user: User = Depends(get_current_user)):
    form_data = await request.form()
    filename = form_data['file'].filename
    file = form_data['file']
    email = form_data.get('email')
    number = form_data.get('number')
    address = form_data.get('address')
    primary_email = user.username
    # primary_email = form_data.get('primary_email')
    query = select(User).where(User.username == user.username)
    user_db = db.exec(query).first()
    if user_db:
        try:
            IMG_DIR = os.path.join(PROJECT_ROOT, f'backend/static/img/{user.username}/profile')
            content = await file.read()
            if not os.path.exists(IMG_DIR):
                os.makedirs(IMG_DIR, exist_ok=True)
            with open(f"static/img/{user.username}/profile/{filename}", 'wb') as f:
                f.write(content)
        except Exception as e:
            logger.error(f"Something went wrong, error: {e}")
        user_profile = UserProfile(profile_id=user.id,
                                   email=email,
                                   number=number,
                                   primary_email=primary_email,
                                   address=address,
                                   avatar=filename)
        try:
            db.add(user_profile)
            db.commit()
            db.refresh(user_profile)
            logger.info(f"User profile has been created {user_profile}")
        except Exception as e:
            db.rollback()
            return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Something went wrong, error {e}")
    return user_profile

@profile_router.post("/update_profile", status_code=status.HTTP_200_OK, include_in_schema=False)
async def update_profile(request: Request, db: Session = Depends(get_session), user: User = Depends(get_current_user)):
    form_data = await request.form()
    json_data = dict(form_data)
    for k, v in json_data.items():
        if v == '':
            json_data[k] = None
    filename = form_data['file'].filename
    db_profile = ProfileActions().get_profile_by_user_id(db=db, user_id=user.id)
    if db_profile is None:
        raise HTTPException(status_code=404, detail=f"No profile with user_id: {user.id} found")
    query = select(User).where(User.username == user.username)
    user_db = db.exec(query).first()
    if user_db:
        try:
            if form_data['file'].filename:
                content = await form_data['file'].read()
                with open(f"static/img/{user.username}/profile/{form_data['file'].filename}", 'wb') as f:
                    f.write(content)
        except Exception as e:
            logger.error(f"Something went wrong, error: {e}")
        new_data = UserProfile(**dict(json_data), user=user, avatar=filename if filename else None).dict(exclude_unset=True,
                                                                                                          exclude_none=True)
        for key, value in new_data.items():
            setattr(db_profile, key, value)
            db.commit()
            db.refresh(db_profile)
    json_compatible_item_data = jsonable_encoder(db_profile)
    return JSONResponse(content=json_compatible_item_data)


@profile_router.post("/", status_code=status.HTTP_201_CREATED, include_in_schema=True)
async def create_profile(user_profile: UserProfile, db: Session = Depends(get_session), user: User = Depends(get_current_user)):
    avatar = 'img_avatar.png'
    IMG_DIR = os.path.join(PROJECT_ROOT, f'static/img/{user_profile.primary_email}/profile/')
    SOURCE_DIR = os.path.join(PROJECT_ROOT, f'static/img/img_avatar.png')
    if not os.path.exists(IMG_DIR):
                os.makedirs(IMG_DIR, exist_ok=True)
                shutil.copy2(SOURCE_DIR, IMG_DIR)
    profile = UserProfile(profile_id=user.id,
                            email=user_profile.email if user_profile.email else None,
                            number=user_profile.number if user_profile.number else None,
                            primary_email=user.username,
                            address=user_profile.address if user_profile.address else None,
                            avatar=user_profile.avatar if user_profile.avatar else avatar)
    try:
        db.add(profile)
        db.commit()
        db.refresh(profile)
    except Exception as e:
            db.rollback()
            return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Something went wrong, error {e}")
    return profile

@profile_router.put("/{user_id}", status_code=status.HTTP_200_OK, response_model=UserProfileUpdate, include_in_schema=True)
async def update_profile(request: Request, user_id: int,  db: Session = Depends(get_session), user: User = Depends(get_current_user)):
        data = await request.json()
        db_profile = ProfileActions().get_profile_by_user_id(db=db, user_id=user_id)
        if db_profile is None:
            raise HTTPException(status_code=404, detail=f"No profile with user_id: {id} found")
        new_data = UserProfile(**dict(data), user=user).dict(exclude_unset=True)
        for key, value in new_data.items():
            setattr(db_profile, key, value)
            db.commit()
            db.refresh(db_profile)
        return db_profile


@profile_router.delete("/delete/{user_id}", status_code=status.HTTP_204_NO_CONTENT, include_in_schema=True)
def get_item_by_id(user_id: int, db: Session = Depends(get_session), user: User = Depends(get_current_user)) -> None:
    profile = ProfileActions().get_profile_by_user_id(db=db, user_id=user_id)
    if profile is None:
        raise HTTPException(status_code=404, detail=f"No profile with id: {user_id} found!")
    ProfileActions().delete_profile_by_user_id(db=db, user_id=user_id)
