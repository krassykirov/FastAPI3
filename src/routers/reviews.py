from fastapi import APIRouter, status, Form
from fastapi import Request, Depends, HTTPException
from fastapi.responses import JSONResponse
from src.db import get_session
from sqlalchemy.orm import Session
from src.crud.crud import ReviewActions, ItemActions
from src.models import Review, User
from src.auth.oauth import get_current_user

PROTECTED = [Depends(get_current_user)]

reviews_router = APIRouter(prefix='/api/reviews', tags=["reviews"], dependencies=PROTECTED,
                            responses={404: {"description": "Not found"}},)


@reviews_router.get("/{id}", status_code=status.HTTP_200_OK, response_model=Review)
def get_review_by_id( id: int, db: Session = Depends(get_session)):
    """ Return review by given id"""
    comment = ReviewActions().get_review_by_id(db=db, id=id)
    if comment is None:
        raise HTTPException(status_code=404, detail=f"No comment with id {id} found")
    return comment

@reviews_router.get("/item/by_user", status_code=status.HTTP_200_OK, response_model=list[Review])
def get_item_reviews_by_user( item_id: int, db: Session = Depends(get_session), user: User = Depends(get_current_user)):
    """ Return all reviews of an Item """
    reviews = ReviewActions().get_item_reviews(db=db, id=item_id)
    if reviews is None:
        raise HTTPException(status_code=404, detail=f"No item with id '{item_id}' found")
    review =  [item for item in reviews if item.created_by == user.username]
    if review is None:
        raise HTTPException(status_code=404, detail=f"No reviews found")
    return review # JSONResponse(content= comments)

@reviews_router.get("/", status_code=status.HTTP_200_OK, response_model=list[Review])
def get_item_reviews( item_id: int, db: Session = Depends(get_session)):
    """ Return all reviews of an Item """
    reviews = ReviewActions().get_item_reviews(db=db, id=item_id)
    if reviews is None:
        raise HTTPException(status_code=404, detail=f"No reviews found")
    return reviews # JSONResponse(content= comments)

@reviews_router.get("/item/rating", status_code=status.HTTP_200_OK, include_in_schema=True)
def get_item_rating(id: int, db: Session=Depends(get_session)):
    """Get Item rating"""
    rating = ReviewActions().get_item_reviews_rating(db=db,id=id)
    return rating

@reviews_router.post('/create_review/{item_id}')
async def create_review(text: str, item_id: int, db: Session=Depends(get_session), user: User = Depends(get_current_user)):
    """ Create a review for an Item """
    item = ItemActions().get_item_by_id(db=db, id=item_id)
    if item is None:
        raise HTTPException(status_code=404, detail=f"No item with id '{item_id}' found")
    review = Review(text=text, item=item, item_id=item.id, created_by=user.username)
    db.add(review)
    db.refresh(review)
    return review