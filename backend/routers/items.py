from fastapi import APIRouter, Query, Response, BackgroundTasks, UploadFile
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi import Request, Depends, HTTPException, status
from db import get_session
from sqlalchemy.orm import Session
from sqlalchemy import or_
from models import Item, User
from pydantic import Field
import schemas
from crud.crud import ItemActions, CategoryActions
from typing import Optional, List, Annotated, Union
from auth.oauth import get_current_user
from my_logger import detailed_logger
from routers.categories import get_category_items
from helper import delete_item_dir
import routers.reviews
import re, os
from datetime import datetime, timedelta
from os.path import abspath
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent # /
BASE_DIR = Path(__file__).resolve().parent # / src

PROTECTED = [Depends(get_current_user)]

logger = detailed_logger()

items_router = APIRouter(prefix='/api/items', tags=["items"],
                          responses={404: {"description": "Not found"}})

@items_router.get("/item/{item_id}", status_code=status.HTTP_200_OK)
def get_item_by_id(item_id: int, db: Session = Depends(get_session)) -> schemas.ItemRead:
    try:
        item = ItemActions().get_item_by_id(db=db, id=item_id)
        if item:
            return item
        else:
          raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Item with id:{item_id} not found")
    except Exception as e:
        logger.error(f"Error fetching item, error message: {e}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Error fetching item {e}")

@items_router.get("/", status_code=status.HTTP_200_OK)
def get_items(request: Request, db: Session = Depends(get_session), user: User = Depends(get_current_user)):
    try:
        items_db = ItemActions().get_items(db=db)
        items_liked = jsonable_encoder([item for item in items_db if item.liked])
        items_in_cart = jsonable_encoder([item for item in items_db if item.in_cart])
        items = jsonable_encoder(items_db)

        items_in_cart = [item for item in items_in_cart
                                for k, v in item.get('in_cart').items()
                                if k == user.username and v.get('in_cart') == True]
        items_liked =  [item for item in items_liked
                                for k, v in item.get('liked').items()
                                if k == user.username and v.get('liked') == True]
        total = sum(item['price'] for item in items_in_cart)

        updated_items = {
            'items': items,
            'items_in_cart': items_in_cart,
            'items_liked': items_liked,
            'len_items_in_cart': len(items_in_cart),
            'total': total
        }
        return updated_items
    except Exception as e:
        logger.error(f"Error fetching items, error message: {e}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Error fetching items")

@items_router.post("/create_item", status_code=status.HTTP_201_CREATED, include_in_schema=False)
@items_router.post("/products/create_item", status_code=status.HTTP_201_CREATED,  include_in_schema=False)
@items_router.post("/user_items_in_cart/create_item", status_code=status.HTTP_201_CREATED, include_in_schema=False)
@items_router.post("/user/profile/create_item", status_code=status.HTTP_201_CREATED,  include_in_schema=False)
async def create_item(request: Request, db: Session = Depends(get_session), user: User = Depends(get_current_user)):
        """ Create an Item """
        form_data = await request.form()
        item = dict(form_data)
        file = form_data['file']
        files_initial: List[UploadFile] = form_data.getlist('files')
        files = [file.filename for file in files_initial]
        files_dict = {'images': files}
        filename = form_data['file'].filename
        item_name = form_data['name']
        category_select = form_data['Category']
        category = CategoryActions().get_category_by_name(db=db, name=category_select)
        item_db = db.query(Item).where(Item.name == item_name).first()
        if item_db:
            logger.error(f"Item with that name already exists!")
            raise HTTPException(status_code=403,detail=f"Item with that name already exists!")
        IMG_DIR = os.path.join(PROJECT_ROOT, f'static/img')
        content = await file.read()
        path = os.path.join(IMG_DIR, item_name)
        if not os.path.exists(path):
               os.makedirs(path,exist_ok=True)
        with open(f"{PROJECT_ROOT}/static/img/{item_name}/{filename}", 'wb') as f:
            f.write(content)
        if files_initial:
            for file in files_initial:
                content = await file.read()
                with open(f"{PROJECT_ROOT}/static/img/{item_name}/{file.filename}", 'wb') as f:
                    f.write(content)
        try:
            logger.info(f"Add to DB Item {item}")
            item = Item(**item, category=category, image=filename, images=files_dict, username=user.username)
            item.update_discount()
            db.add(item)
            db.commit()
            db.refresh(item)
        except Exception as e:
            logger.info(f"ERROR OCCURED to DB Item {e}")
            db.rollback()
        return item

@items_router.post("/update_item", include_in_schema=True)
async def update_item(request: Request, db: Session=Depends(get_session)):
    form_data = await request.form()
    item_id = form_data['itemID']
    item = ItemActions().get_item_by_id(db=db, id=item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    files_initial: List[UploadFile] = form_data.getlist('files')
    files = [file.filename for file in files_initial]
    files_dict = {'images': files}
    if files_initial:
        for file in files_initial:
            content = await file.read()
            with open(f"{PROJECT_ROOT}/static/img/{item.name}/{file.filename}", 'wb') as f:
                f.write(content)
    item.images = files_dict
    db.commit()
    db.refresh(item)
    return item

@items_router.delete("/delete/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item_by_id(item_id: int, background_tasks: BackgroundTasks, db: Session = Depends(get_session), user: User = Depends(get_current_user)):
    item = ItemActions().get_item_by_id(db=db, id=item_id)
    ItemActions().delete_item_by_id(db=db, id=item_id)
    dir_to_delete = os.path.abspath(os.path.join('static/img', user.username, item.name))
    if os.path.exists(dir_to_delete):
        background_tasks.add_task(delete_item_dir, path=dir_to_delete)
    else:
        logger.error(f"Directory does not exist: {dir_to_delete}")

@items_router.post("/update-basket", status_code=status.HTTP_200_OK,  include_in_schema=False)
async def update_basket(request: Request, db: Session = Depends(get_session), user: User = Depends(get_current_user)):
    data = await request.json()
    item = ItemActions().get_item_by_id(db=db, id=data.get('item_id'))
    new_dict = {user.username: {"in_cart": True}}
    basket = dict(item.in_cart, **new_dict)
    item.in_cart = basket
    db.commit()
    db.refresh(item)
    return True

@items_router.post("/remove-from-basket", status_code=status.HTTP_200_OK,  include_in_schema=False)
async def remove_from_basket(request: Request, db: Session = Depends(get_session), user: User = Depends(get_current_user)):
    data = await request.json()
    item = ItemActions().get_item_by_id(db=db, id=data.get('item_id'))
    new_dict = {user.username: {"in_cart": False}}
    basket = dict(item.in_cart, **new_dict )
    item.in_cart = basket
    db.commit()
    db.refresh(item)
    return True

@items_router.post("/update-favorites", status_code=status.HTTP_200_OK,  include_in_schema=False)
async def update_favorites(request: Request, db: Session = Depends(get_session), user: User = Depends(get_current_user)):
    data = await request.json()
    item = ItemActions().get_item_by_id(db=db, id=data.get('item_id'))
    new_dict = {user.username: {"liked": True}}
    favorites = dict(item.liked, **new_dict )
    item.liked = favorites
    db.commit()
    db.refresh(item)
    return True
    # result = get_user_items_in_cart(db=db, user=user)
    # return result

@items_router.post("/remove-from-favorites", status_code=status.HTTP_200_OK,  include_in_schema=True)
async def remove_from_favorites(request: Request, db: Session = Depends(get_session), user: User = Depends(get_current_user)):
    data = await request.json()
    logger.info('remove-from-favorites', data)
    item = ItemActions().get_item_by_id(db=db, id=data.get('item_id'))
    new_dict = {user.username: {"liked": False}}
    favorites = dict(item.liked, **new_dict )
    item.liked = favorites
    db.commit()
    db.refresh(item)
    return True

@items_router.post("/update_product_ajax", status_code=status.HTTP_200_OK, include_in_schema=False, response_model=schemas.ItemRead)
async def update_item_api(request: Request, db: Session=Depends(get_session), user: User = Depends(get_current_user)) -> schemas.ItemRead:
    data = await request.json()
    category_select = data.get('category')
    price = data.get('price')
    description = data.get('description')
    new_category = CategoryActions().get_category_by_name(db= db, name=category_select)
    item = ItemActions().get_item_by_id(db=db, id=data.get('id'))
    if not item:
        logger.error("Item not found")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    if not new_category:
        logger.error("Category not found")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    if user.username != item.username:
        logger.info('You cannot update this item')
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User cannot update this item")
    try:
        if new_category:
            item.category=new_category
        if price:
            item.price=price
        if description:
            item.description=description
        db.commit()
        db.refresh(item)
    except Exception as e:
        db.rollback()
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Something went wrong, error {e}")
    return item

@items_router.post("/checkout", status_code=status.HTTP_200_OK,  include_in_schema=True)
async def checkout(request: Request, db: Session = Depends(get_session), user: User = Depends(get_current_user)):
    form_data = await request.form()
    logger.info('data checkout', form_data)
    return JSONResponse(content="Your Order has been processed!")
    # item = ItemActions().get_item_by_id(db=db, id=data.get('item_id'))
    # new_dict = {user.username: {"liked": True}}
    # favorites = dict(item.liked, **new_dict )
    # item.liked = favorites
    # db.commit()
    # db.refresh(item)
    # result = get_user_items_in_cart(db=db, user=user)
    # return result
@items_router.get("/search/")
async def search_items(q: List[str] = Query(None), db: Session = Depends(get_session)):
    query_filters = []
    categories_user_input = ["Laptops", "Smartphones", "Tablets", "Smartwatches", "TV"]
    if q:
        for category_name in categories_user_input:
            if category_name.lower().startswith(q[0].lower()):
                items_in_category = get_category_items(db=db, name=category_name)
                return items_in_category.items
    if q:
        for param in q:
            query_filters.append(Item.name.ilike(f"%{param}%"))

    query = db.query(Item)
    if query_filters:
        query = query.filter(or_(*query_filters))

    results = query.all()
    results = jsonable_encoder(results)
    for item in results:
        item.update({'discount_price' : round((item.get('price')
                                                - item.get('price') * item.get('discount')
                                                if item.get('discount') else item.get('price')),2)})
        item_reviews = routers.reviews.ReviewActions().get_item_reviews(db=db, id=item.get('id'))
        if item_reviews:
            result = [item.rating for item in item_reviews if item.rating]
            if result:
                rating = sum(result) / len(result)
                item.update({'rating':round(rating),
                             'review_number': len(result),
                             'rating_float': float(sum(result) / len(result))})
        else:
            item.update({'rating': 0, 'review_number': 0, 'rating_float': 0})
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
