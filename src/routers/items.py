from fastapi import APIRouter
from fastapi import Request, Depends, HTTPException, status
from src.db import get_session
from sqlalchemy.orm import Session
from src.models import Item, User
import src.schemas
from src.crud.crud import ItemActions, CategoryActions
from typing import Optional, List, Annotated, Union
from src.auth.oauth import get_current_user

PROTECTED = [Depends(get_current_user)]

items_router = APIRouter(prefix='/api/items', tags=["items"], dependencies=PROTECTED,
                          responses={404: {"description": "Not found"}})

@items_router.get("/item/{id}", status_code=status.HTTP_200_OK, response_model=src.schemas.ItemRead)
def get_item_by_id( id: int, db: Session = Depends(get_session)) -> src.schemas.ItemRead:
    item = ItemActions().get_item_by_id(db=db, id=id)
    if item is None:
        raise HTTPException(status_code=404, detail=f"No item with id: {id} found")
    return item

@items_router.get("/", status_code=status.HTTP_200_OK, response_model=list[src.schemas.ItemRead])
def get_items(skip: int = 0, limit: int = 100,
              db: Session = Depends(get_session), user: User = Depends(get_current_user)) -> List[src.schemas.ItemRead]:
    items = ItemActions().get_items(db=db, skip=skip, limit=limit, user=user.username)
    if items is None:
        raise HTTPException(status_code=404, detail=f"No items found")
    return items

@items_router.put("/update_item/{id}", include_in_schema=True, response_model=src.schemas.ItemRead)
async def update_item(id: int, price: str, db: Session=Depends(get_session)) -> src.schemas.ItemRead:
    item = ItemActions().get_item_by_id(db=db, id=id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    new_data = Item(id=id, price=price).dict(exclude_unset=True)
    for key, value in new_data.items():
        setattr(item, key, value)
        db.commit()
        db.refresh(item)
    return item

@items_router.put("/update_item_new/{id}", include_in_schema=True, response_model=src.schemas.ItemRead)
async def update_item(id: int, item_update: src.schemas.ItemUpdate, db: Session=Depends(get_session)) -> src.schemas.ItemRead:
    item = ItemActions().get_item_by_id(db=db, id=id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    new_data = Item(**dict(item_update), id=item).dict(exclude_unset=True, exclude_none=True)
    for key, value in new_data.items():
        setattr(item, key, value)
        db.commit()
        db.refresh(item)
    return item

@items_router.post("/", status_code=status.HTTP_201_CREATED, response_model=src.schemas.ItemRead)
def create_item(item: src.schemas.ItemCreate, db: Session = Depends(get_session), user: User = Depends(get_current_user)) -> src.schemas.ItemRead:
    item = Item.from_orm(item, {'username': user.username})
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@items_router.delete("/delete/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item_by_id(item_id: int, db: Session = Depends(get_session), user: User = Depends(get_current_user)):
    ItemActions().delete_item_by_id(db=db, id=item_id)





