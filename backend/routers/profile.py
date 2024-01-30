from fastapi import APIRouter, status
from fastapi import Request, Depends, HTTPException
from db import get_session
from crud.crud import ProfileActions
from sqlalchemy.orm import Session
from models import UserProfile, User
from auth.oauth import get_current_user
from schemas import UserProfileUpdate
from fastapi.encoders import jsonable_encoder
from typing import List

PROTECTED = [Depends(get_current_user)]

profile_router = APIRouter(prefix='/api/profile', tags=["profile"], dependencies=PROTECTED,
                            responses={404: {"description": "Not found"}},)


@profile_router.get("/", status_code=status.HTTP_200_OK, response_model=List[UserProfile], include_in_schema=True)
def get_profiles(db: Session = Depends(get_session)) -> List[UserProfile]:
    profiles = ProfileActions().get_profiles(db=db)
    if profiles is None:
        raise HTTPException(status_code=404, detail=f"No profiles found")
    profiles = jsonable_encoder(profiles)
    return profiles

@profile_router.get("/{user_id}", status_code=status.HTTP_200_OK, response_model=UserProfile, include_in_schema=True)
def get_profile(user_id: int, db: Session = Depends(get_session)) -> UserProfile:
    profile = ProfileActions().get_profile_by_user_id(db=db, user_id=user_id)
    if profile is None:
        raise HTTPException(status_code=404, detail=f"No profile with user_id: {id} found")
    return jsonable_encoder(profile)

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


@profile_router.delete("/delete/{user_id}", status_code=status.HTTP_200_OK, include_in_schema=True)
def get_item_by_id(user_id: int, db: Session = Depends(get_session), user: User = Depends(get_current_user)) -> None:
    profile = ProfileActions().get_profile_by_user_id(db=db, user_id=user_id)
    if profile is None:
        raise HTTPException(status_code=404, detail=f"No profile with id: {user_id} found!")
    ProfileActions().delete_profile_by_user_id(db=db, user_id=user_id)
    return "Succesifully Deleted profile"
