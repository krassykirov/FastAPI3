from fastapi import APIRouter, status, Form
from fastapi import Request, Depends, HTTPException
from fastapi.responses import JSONResponse
from src.db import get_session
from sqlalchemy.orm import Session
from src.crud.crud import CommentActions, ItemActions
from src.schemas  import Comment
from src.auth.oauth import get_current_user

PROTECTED = [Depends(get_current_user)]

comments_router = APIRouter(prefix='/api/comments', tags=["comments"], dependencies=PROTECTED,
                            responses={404: {"description": "Not found"}},)


@comments_router.get("/{id}", status_code=status.HTTP_200_OK, response_model=Comment)
def get_comment_by_id( id: int, db: Session = Depends(get_session)):
    """ Return comment by given id"""
    comment = CommentActions().get_comment_by_id(db=db, id=id)
    if comment is None:
        raise HTTPException(status_code=404, detail=f"No comment with id {id} found")
    return comment

@comments_router.get("/", status_code=status.HTTP_200_OK, response_model=list[Comment])
def get_item_comments( item_id: int, db: Session = Depends(get_session)):
    """ Return all comments of an Item """
    comments = CommentActions().get_item_comments(db=db, item_id=item_id)
    if comments is None:
        raise HTTPException(status_code=404, detail=f"No comments found")
    return comments # JSONResponse(content= comments)