from fastapi import APIRouter, status, Query
from fastapi import Request, Depends, HTTPException
from fastapi.responses import JSONResponse
from db import get_session
from sqlalchemy.orm import Session
from crud.crud import ReviewActions, ItemActions
from models import Review, User
from auth.oauth import get_current_user
from typing import List

# PROTECTED = [Depends(get_current_user)]

reviews_router = APIRouter(prefix='/api/reviews', tags=["reviews"],
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
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No item with id '{item_id}' found")
    review =  [item for item in reviews if item.created_by == user.username]
    if review is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No reviews found")
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

@reviews_router.get("/item/ratings", status_code=status.HTTP_200_OK, include_in_schema=True)
def get_item_reviews_rating_new(request: Request, db: Session=Depends(get_session)):
    all_reviews = []
    items = ItemActions().get_items(db=db)
    try:
        for item in items:
            item_reviews = ReviewActions().get_item_reviews(db=db, id=item.id)
            if item_reviews:
                result = [item.rating for item in item_reviews if item.rating]
                if result:
                    rating = sum(result) / len(result)
                    review = {item.id:{'rating':round(rating), 'review_number': len(result), 'rating_float': float(sum(result) / len(result)) }}
                else:
                    review = {item.id: {'rating':0, 'review_number': 0, 'rating_float': 0} }
                all_reviews.append(review)
    except Exception as e:
        print('error', e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Unable to fetch items reviews!")
    return all_reviews


@reviews_router.post('/create_review/{item_id}')
async def create_review(text: str, item_id: int, db: Session=Depends(get_session), user: User = Depends(get_current_user)):
    """ Create a review for an Item """
    item = ItemActions().get_item_by_id(db=db, id=item_id)
    if item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No item with id '{item_id}' found")
    review = Review(text=text, item=item, item_id=item.id, created_by=user.username)
    db.add(review)
    db.refresh(review)
    return review