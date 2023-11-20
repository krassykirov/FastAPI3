from fastapi import APIRouter, status, Form
from fastapi import Request, Depends, HTTPException
from fastapi.responses import JSONResponse
from src.db import get_session
from sqlalchemy.orm import Session
from src.crud.crud import CategoryActions
from src.schemas import Category, CategoryEvents
import src.models
from src.auth.oauth import get_current_user

PROTECTED = [Depends(get_current_user)]

category_router = APIRouter(prefix='/api/categories', tags=["categories"], dependencies=PROTECTED,
                            responses={404: {"description": "Not found"}},)

@category_router.get("/{id}", status_code=status.HTTP_200_OK, response_model=Category)
def get_category_by_id(request: Request, id: int, db: Session = Depends(get_session)):
    """ Return category by given id"""
    category = CategoryActions().get_category_by_id(db=db, id=id)
    if category is None:
        raise HTTPException(status_code=404, detail=f"No category with id {id} found")
    print("category.events", category, type(category))
    return category

@category_router.get("/", status_code=status.HTTP_200_OK, response_model=list[Category])
def get_categoriess(request: Request, skip: int = 0, limit: int = 100, db: Session = Depends(get_session)):
    """ Return all categories """
    categories = CategoryActions().get_categories(db=db, skip=skip, limit=limit)
    if categories is None:
        raise HTTPException(status_code=404, detail=f"No categories found")
    return categories # JSONResponse(content= categories)


@category_router.get("/category_items/", status_code=status.HTTP_200_OK, response_model=CategoryEvents)
def get_category_events(request: Request, name: str, db: Session = Depends(get_session)):
    """ Return all items in a category """
    category = CategoryActions().get_category_by_name(db=db, name=name)
    if category is None:
        raise HTTPException(status_code=404, detail=f"No category with id {id} found")
    return category

@category_router.post("/", status_code=status.HTTP_201_CREATED, response_model=Category)
def create_category(request: Request, category: src.models.Category, db: Session = Depends(get_session)):
    """ Create category """
    c = CategoryActions().get_category_by_name(db=db, name=category.name)
    print('c:', c)
    if c is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"Category with name:'{c.name}' already exist")
    if category.name =='':
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Category Name is required!")
    cat = CategoryActions().create_category(db=db, category=category)
    return cat

@category_router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(request: Request, category_id: int, db: Session = Depends(get_session)):
    """ Delete category """
    category = CategoryActions.get_category_by_id(db=db, id=category_id)
    if category is None:
       raise HTTPException(status_code=404, detail=f"No category with id {id} found")
    CategoryActions().delete_category(db=db, id=category_id)

