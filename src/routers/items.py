from fastapi import APIRouter
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi import Request, Depends, HTTPException, status
from src.db import get_session
from sqlalchemy.orm import Session
from src.models import Item, User
import src.schemas
from src.crud.crud import ItemActions, CategoryActions
from typing import Optional, List, Annotated, Union
from src.auth.oauth import get_current_user

# PROTECTED = [Depends(get_current_user)]

items_router = APIRouter(prefix='/api/items', tags=["items"],
                          responses={404: {"description": "Not found"}})

@items_router.get("/item/{item_id}", status_code=status.HTTP_200_OK, response_model=src.schemas.ItemRead)
def get_item_by_id( item_id: int, db: Session = Depends(get_session)) -> src.schemas.ItemRead:
    item = ItemActions().get_item_by_id(db=db, id=item_id)
    if item is None:
        raise HTTPException(status_code=404, detail=f"No item with id: {item_id} found")
    return item

@items_router.get("/", status_code=status.HTTP_200_OK, response_model=list[src.schemas.ItemRead])
def get_items(skip: int = 0, limit: int = 100,
              db: Session = Depends(get_session), user=None) -> List[src.schemas.ItemRead]:
    items = ItemActions().get_items(db=db, skip=skip, limit=limit, user=user)
    if items is None:
        raise HTTPException(status_code=404, detail=f"No items found")
    return jsonable_encoder(items)

@items_router.get("/by-category", status_code=status.HTTP_200_OK, response_model=list[src.schemas.ItemRead])
async def get_items_by_category( request: Request, category_id: int, db: Session=Depends(get_session)):
    items = ItemActions().get_items_by_category_id(db=db, category_id=category_id)
    json_compatible_item_data = jsonable_encoder(items)
    return JSONResponse(content = json_compatible_item_data)

@items_router.post("/", status_code=status.HTTP_201_CREATED, response_model=src.schemas.ItemRead)
def create_item(item: src.schemas.ItemCreate, db: Session = Depends(get_session), user: User = Depends(get_current_user)) -> src.schemas.ItemRead:
    item = Item.from_orm(item, {'username': user.username})
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@items_router.put("/update_item/{item_id}", include_in_schema=True, response_model=src.schemas.ItemRead)
async def update_item(item_id: int, item_update: src.schemas.ItemUpdate, db: Session=Depends(get_session)) -> src.schemas.ItemRead:
    item = ItemActions().get_item_by_id(db=db, id=item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    new_data = Item(**dict(item_update), id=item).dict(exclude_unset=True, exclude_none=True)
    for key, value in new_data.items():
        setattr(item, key, value)
        db.commit()
        db.refresh(item)
    return item

@items_router.delete("/delete/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item_by_id(item_id: int, db: Session = Depends(get_session), user: User = Depends(get_current_user)):
    ItemActions().delete_item_by_id(db=db, id=item_id)


@items_router.get("/items-in-cart", status_code=status.HTTP_200_OK, include_in_schema=True)
async def get_user_items_in_cart(request: Request, db: Session=Depends(get_session)):
    items = ItemActions().get_items(db=db)
    items_in_cart =  [item for item in items for k, v in item.in_cart.items()
                      if k == 'krassy@mail.bg' and v['in_cart'] == True]
    return items_in_cart





