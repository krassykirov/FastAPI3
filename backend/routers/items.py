from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi import Request, Depends, HTTPException, status
from db import get_session
from sqlalchemy.orm import Session
from sqlalchemy import or_
from models import Item, User
import schemas
from crud.crud import ItemActions, CategoryActions
from typing import Optional, List, Annotated, Union
from auth.oauth import get_current_user
from my_logger import detailed_logger
from routers.categories import get_category_items
import routers.reviews
import re

PROTECTED = [Depends(get_current_user)]

logger = detailed_logger()

items_router = APIRouter(prefix='/api/items', tags=["items"],
                          responses={404: {"description": "Not found"}})

@items_router.get("/item/{item_id}", status_code=status.HTTP_200_OK, response_model=schemas.ItemRead)
def get_item_by_id( item_id: int, db: Session = Depends(get_session)) -> schemas.ItemRead:
    item = ItemActions().get_item_by_id(db=db, id=item_id)
    item = jsonable_encoder(item)
    if item is None:
        raise HTTPException(status_code=404, detail=f"No item with id: {item_id} found")
    item.update({'discount_price' : round((item.get('price')
                                            - item.get('price') * item.get('discount')
                                            if item.get('discount') else item.get('price')),2)},)
    return item

@items_router.get("/", status_code=status.HTTP_200_OK)
def get_items(db: Session = Depends(get_session), user: User = Depends(get_current_user)):
    try:
        items = ItemActions().get_items(db=db)
        items = jsonable_encoder(items)
        for item in items:
            item.update({'discount_price' : round((item.get('price')
                                                - item.get('price') * item.get('discount')
                                                if item.get('discount') else item.get('price')),2)})
            item_reviews = routers.reviews.ReviewActions().get_item_reviews(db=db, id=item.get('id'))
            if item_reviews:
                result = [item.rating for item in item_reviews if item.rating]
                if result:
                    rating = sum(result) / len(result)
                    item.update({ 'rating':round(rating),
                                  'review_number': len(result),
                                  'rating_float': float(sum(result) / len(result))})
            else:
                item.update({'rating': 0, 'review_number': 0, 'rating_float': 0})
        items_in_cart = [item for item in items
                                for k, v in item.get('in_cart').items()
                                if k == user.username and v.get('in_cart') == True]
        items_liked =  [item for item in items
                                for k, v in item.get('liked').items()
                                if k == user.username and v.get('liked') == True]
        total = sum([item.get('price') for item in items_in_cart])
        json_items = {'items': items,
                      'items_in_cart': items_in_cart,
                      'items_liked': items_liked,
                      'len_items_in_cart': len(items_in_cart),
                      'total': total,
                      'user': user.username,
                      'user_id': user.id}
        if items is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No items found")
        return json_items
    except Exception as e:
        logger.error(f"Error fetching items, error message: {e}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Error fetching items")

@items_router.get("/search/")
async def read_items(q: List[str] = Query(None), db: Session = Depends(get_session)):
    query_filters = []
    categories_user_input = ["Laptops", "Smartphones", "Tablets", "Smartwatches", "TV"]
    print('q', q)
    if q:
        for category_name in categories_user_input:
            if category_name.lower().startswith(q[0].lower()):
                items_in_category = get_category_items(db=db, name=category_name)
                return items_in_category.items
    if q:
        for param in q:
            print('param', param)
            # query_filters.append(Item.name.contains(param.lower()))
            query_filters.append(Item.name.ilike(f"%{param}%"))

    query = db.query(Item)
    if query_filters:
        query = query.filter(or_(*query_filters))

    results = query.all()
    return results

@items_router.get("/by-category", status_code=status.HTTP_200_OK, response_model=list[schemas.ItemRead])
async def get_items_by_category( request: Request, category_id: int, db: Session=Depends(get_session)):
    items = ItemActions().get_items_by_category_id(db=db, category_id=category_id)
    json_compatible_item_data = jsonable_encoder(items)
    return JSONResponse(content = json_compatible_item_data)

@items_router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.ItemRead)
def create_item(item: schemas.ItemCreate, db: Session = Depends(get_session), user: User = Depends(get_current_user)) -> schemas.ItemRead:
    item = Item.from_orm(item, {'username': user.username})
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@items_router.put("/update_item/{item_id}", include_in_schema=True, response_model=schemas.ItemRead)
async def update_item(request: Request, item_id: int, item_update: schemas.ItemUpdate, db: Session=Depends(get_session)) -> schemas.ItemRead:
    data = await request.json()
    item = ItemActions().get_item_by_id(db=db, id=item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    new_data = Item(**dict(item_update), id=item, quantity=data.get('quantity')).dict(exclude_unset=True, exclude_none=True)
    for key, value in new_data.items():
        setattr(item, key, value)
        db.commit()
        db.refresh(item)
    return item

@items_router.delete("/delete/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item_by_id(item_id: int, db: Session = Depends(get_session), user: User = Depends(get_current_user)):
    ItemActions().delete_item_by_id(db=db, id=item_id)

@items_router.get("/user-items-in-cart", status_code=status.HTTP_200_OK, include_in_schema=True)
def get_user_items_in_cart(db: Session=Depends(get_session), user: User = Depends(get_current_user)):
    try:
        items = ItemActions().get_items(db=db)
        items_in_cart =  [item for item in items
                            for k, v in item.in_cart.items()
                            if k == user.username and v['in_cart'] == True]
        items_liked =  [item for item in items
                            for k, v in item.liked.items()
                            if k == user.username and v['liked'] == True]
        total = sum([item.price for item in items_in_cart])
        json_items = {'items': items_in_cart, 'items_liked': items_liked, 'items_in_cart': len(items_in_cart),
                'total': total, 'user': user.username, 'user_id': user.id}
        return json_items
    except Exception as e:
            logger.error(f"Error getting items in cart, error message: {e}")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Error getting items in cart")

@items_router.post("/update-basket", status_code=status.HTTP_200_OK,  include_in_schema=False)
async def update_basket(request: Request, db: Session = Depends(get_session), user: User = Depends(get_current_user)):
    data = await request.json()
    item = ItemActions().get_item_by_id(db=db, id=data.get('item_id'))
    new_dict = {user.username: {"in_cart": True}}
    basket = dict(item.in_cart, **new_dict )
    item.in_cart = basket
    db.commit()
    db.refresh(item)
    result = get_user_items_in_cart(db=db, user=user)
    total = jsonable_encoder(result.get('total'))
    return total

@items_router.post("/update-favorites", status_code=status.HTTP_200_OK,  include_in_schema=False)
async def update_favorites(request: Request, db: Session = Depends(get_session), user: User = Depends(get_current_user)):
    data = await request.json()
    item = ItemActions().get_item_by_id(db=db, id=data.get('item_id'))
    new_dict = {user.username: {"liked": True}}
    favorites = dict(item.liked, **new_dict )
    item.liked = favorites
    db.commit()
    db.refresh(item)
    result = get_user_items_in_cart(db=db, user=user)
    return result

@items_router.post("/remove-from-favorites", status_code=status.HTTP_200_OK,  include_in_schema=True)
async def remove_from_favorites(request: Request, db: Session = Depends(get_session), user: User = Depends(get_current_user)):
    data = await request.json()
    print('remove-from-favorites', data)
    item = ItemActions().get_item_by_id(db=db, id=data.get('item_id'))
    new_dict = {user.username: {"liked": False}}
    favorites = dict(item.liked, **new_dict )
    item.liked = favorites
    db.commit()
    db.refresh(item)
    return item


