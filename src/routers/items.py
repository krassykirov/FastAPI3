from fastapi import APIRouter
from fastapi import Request, Depends, HTTPException, status
from src.db import get_session
from sqlalchemy.orm import Session
from src.schemas import Item
import src.models
from src.crud.crud import ItemActions, CategoryActions
from typing import Union


items_router = APIRouter(prefix='/api/items', tags=["items"],
                          responses={404: {"description": "Not found"}})


@items_router.get("/item/{id}", status_code=status.HTTP_200_OK, response_model=Item)
def get_item_by_id(request: Request, id: int, db: Session = Depends(get_session)):
    item = ItemActions().get_item_by_id(db=db, id=id)
    if item is None:
        raise HTTPException(status_code=404, detail=f"No item with id: {id} found")
    return item

@items_router.get("/", status_code=status.HTTP_200_OK, response_model=list[Item])
def get_items(request: Request, skip: int = 0, limit: int = 100, db: Session = Depends(get_session)):
    items = ItemActions().get_items(db=db, skip=skip, limit=limit)
    if items is None:
        raise HTTPException(status_code=404, detail=f"No items found")
    return items

@items_router.put("/update_item/{id}", include_in_schema=True, response_model=Item)
async def update_item(request: Request, id: int, price: str, db: Session=Depends(get_session)):
    item = ItemActions().get_item_by_id(db=db, id=id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    new_data = Item(id=id, price=price, name=item.name).dict(exclude_unset=True)
    for key, value in new_data.items():
        setattr(item, key, value)
        db.commit()
        db.refresh(item)
    return item


@items_router.post("/", status_code=status.HTTP_201_CREATED, response_model=Item)
def create_item(request: Request, item: src.models.Item, db: Session = Depends(get_session)):
    item = ItemActions().create_item(db=db, item=item)
    return item

@items_router.delete("/delete/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item_by_id(request: Request, item_id: int, db: Session = Depends(get_session)):
    ItemActions().delete_item_by_id(db=db, id=item_id)


