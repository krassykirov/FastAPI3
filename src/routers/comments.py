from fastapi import APIRouter, status, Form
from fastapi import Request, Depends, HTTPException
from fastapi.responses import JSONResponse
from src.db import get_session
from sqlalchemy.orm import Session
from src.crud.crud import CommentActions, ItemActions
from src.schemas import Comment


comments_router = APIRouter(prefix='/api/comments', tags=["comments"],
                            responses={404: {"description": "Not found"}},)


@comments_router.get("/{id}", status_code=status.HTTP_200_OK, response_model=Comment)
def get_comment_by_id(request: Request, id: int, db: Session = Depends(get_session)):
    """ Return comment by given id"""
    comment = CommentActions().get_comment_by_id(db=db, id=id)
    if comment is None:
        raise HTTPException(status_code=404, detail=f"No comment with id {id} found")
    return comment

@comments_router.get("/", status_code=status.HTTP_200_OK, response_model=list[Comment])
def get_item_comments(request: Request, item_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_session)):
    """ Return all comments of an Item """
    comments = CommentActions().get_item_comments(db=db, item_id=item_id)
    if comments is None:
        raise HTTPException(status_code=404, detail=f"No comments found")
    return comments # JSONResponse(content= comments)