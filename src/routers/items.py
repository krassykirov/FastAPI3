from fastapi import APIRouter
from fastapi import Request, Depends, HTTPException, status
from src.db import get_session
from sqlalchemy.orm import Session
from src.schemas import Item
import src.models
from src.crud import ItemActions, CategoryActions


items_router = APIRouter(prefix='/items', tags=["items"],
                          responses={404: {"description": "Not found"}})

@items_router.get("/{id}", status_code=status.HTTP_200_OK, response_model=Item)
def get_item_by_id(request: Request, id: int, db: Session = Depends(get_session)):
    item = ItemActions().get_item_by_id(db=db, id=id)
    if item is None:
        raise HTTPException(status_code=404, detail=f"No item with id: {id} found")
    return item

@items_router.get("/{id}", status_code=status.HTTP_200_OK, response_model=Item)
def get_item_by_name(request: Request, name: str, db: Session = Depends(get_session)):
    item = ItemActions().get_item_by_name(db=db, name=name)
    if item is None:
        raise HTTPException(status_code=404, detail=f"No item with name: {name} found")
    return item

@items_router.get("/", status_code=status.HTTP_200_OK, response_model=list[Item])
def get_items(request: Request, skip: int = 0, limit: int = 100, db: Session = Depends(get_session)):
    items = ItemActions().get_items(db=db, skip=skip, limit=limit)
    if items is None:
        raise HTTPException(status_code=404, detail=f"No items found")
    return items

@items_router.post("/", status_code=status.HTTP_201_CREATED, response_model=Item)
def create_item(request: Request, item: src.models.Item, db: Session = Depends(get_session)):
    print("ITEM:", item)
    item = ItemActions().create_item(db=db, item=item)
    return item

@items_router.delete("/delete/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item_by_id(request: Request, item_id: int, db: Session = Depends(get_session)):
    ItemActions().delete_item_by_id(db=db, id=item_id)
