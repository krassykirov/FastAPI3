from fastapi import APIRouter, status
from fastapi import Request, Depends, HTTPException
from src.db import get_session
from src.crud.crud import ProfileActions
from sqlalchemy.orm import Session
from src.models import UserProfile, User
from src.auth.oauth import get_current_user

PROTECTED = [Depends(get_current_user)]

profile_router = APIRouter(prefix='/api/profile', tags=["profile"], dependencies=PROTECTED,
                            responses={404: {"description": "Not found"}},)


@profile_router.get("/profile/{user_id}", status_code=status.HTTP_200_OK, response_model=UserProfile, include_in_schema=True)
def get_item_by_id(user_id: int, db: Session = Depends(get_session), user: User = Depends(get_current_user)) -> UserProfile:
    profile = ProfileActions().get_profile_by_user_id(db=db, user_id=user.id)
    if profile is None:
        raise HTTPException(status_code=404, detail=f"No profile with user_id: {id} found")
    return profile
