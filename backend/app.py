from fastapi import Depends,HTTPException,Request, APIRouter, status, Form, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from fastapi.responses import RedirectResponse, JSONResponse
from db import get_session
from sqlalchemy.orm import Session
from sqlalchemy import select
from pathlib import Path
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from sqlmodel import SQLModel, Session
from db import engine
from routers.categories import category_router
from routers.items import items_router
from routers.reviews import reviews_router
from routers.profile import profile_router
# from src.routers.cart import cart_router
from auth.oauth import oauth_router, get_current_user
from models import Item, Category, Review, User, UserRead, UserProfile, Categories
from crud.crud import CategoryActions, ItemActions, ReviewActions, ProfileActions
from helper import delete_item_dir, create_categories
import schemas
import os
from os.path import abspath
from my_logger import detailed_logger
from decimal import Decimal

PROJECT_ROOT = Path(__file__).parent.parent # /
BASE_DIR = Path(__file__).resolve().parent # / src

templates = Jinja2Templates(directory=Path(BASE_DIR, 'static/templates'))

app = FastAPI() # docs_url=None
app.include_router(category_router)
app.include_router(items_router)
app.include_router(reviews_router)
app.include_router(oauth_router)
app.include_router(profile_router)
# app.include_router(cart_router)
origins = [
    "http://127.0.0.1:8000",
    "http://localhost:8000",
    "http://127.0.0.1:8081",
    "http://localhost:8081",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger = detailed_logger()

@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)
    create_categories(engine)
    app.mount("/static", StaticFiles(directory=Path(BASE_DIR, 'static'),html=True),name="static")

@app.get("/", include_in_schema=False)
async def home(request: Request, user: User = Depends(get_current_user)):
    return templates.TemplateResponse("base_old.html", {"request": request, 'current_user': user.username})

@app.get("/products", include_in_schema=False, status_code=status.HTTP_200_OK, response_model=schemas.ItemRead)
def get_products(request: Request, db: Session = Depends(get_session), user: User = Depends(get_current_user)):
    """ Return all Items """
    profile = ProfileActions().get_profile_by_user_id(db=db, user_id=user.id)
    if not profile:
        avatar = '/static/img/img_avatar.png'
    else:
      avatar = jsonable_encoder(profile).get('avatar')
      avatar = f"/static/img/{user.username}/profile/{avatar}"
    return templates.TemplateResponse("items.html", { "request": request,
                                                      "current_user": user.username,
                                                      "profile": profile,
                                                       "avatar": avatar})
                                                    #  'items': items,
                                                    #  'categories': categories,
                                                    #  'profile': profile})

@app.post("/create_item", status_code=status.HTTP_201_CREATED, include_in_schema=False)
@app.post("/user_items_in_cart/create_item", status_code=status.HTTP_201_CREATED, include_in_schema=False)
@app.post("/products/create_item", status_code=status.HTTP_201_CREATED,  include_in_schema=False)
@app.post("/user/profile/create_item", status_code=status.HTTP_201_CREATED,  include_in_schema=False)
async def create_item(request: Request, db: Session = Depends(get_session), user: User = Depends(get_current_user)):
        """ Create an Item """
        form_data = await request.form()
        print('form_data', form_data)
        file = form_data['file']
        filename = form_data['file'].filename
        item_name =form_data['name']
        formated_price = Decimal("{:.2f}".format(float(form_data['price'])))
        category_select = form_data['Category']
        description = form_data['Description']
        discount = form_data['discount']
        category = CategoryActions().get_category_by_name(db=db, name=category_select)
        item = db.query(Item).where(Item.name == item_name).first()
        if item:
            logger.error(f"Item with that name already exists!")
            raise HTTPException(status_code=403,detail=f"Item with that name already exists!")
        IMG_DIR = os.path.join(BASE_DIR, f'static/img/{user.username}')
        content = await file.read()
        path = os.path.join(IMG_DIR, item_name)
        if not os.path.exists(path):
               os.makedirs(path,exist_ok=True)
        with open(f"{BASE_DIR}/static/img/{user.username}/{item_name}/{filename}", 'wb') as f:
            f.write(content)
            item = Item(name=item_name, price=formated_price, image=filename, username=user.username,
                        category=category, discount=discount, description=description)
        logger.info(f"Creating Item {item}")
        try:
            db.add(item)
            db.commit()
            db.refresh(item)
        except:
            db.rollback()
        return item
        # redirect_url = request.url_for('get_products')
        # response = RedirectResponse(redirect_url, status_code=status.HTTP_303_SEE_OTHER)
        # return response

@app.post("/delete_item/", status_code=status.HTTP_204_NO_CONTENT, include_in_schema=False)
@app.post("/items/{id}", include_in_schema=False)
async def delete_item(request: Request, background_tasks: BackgroundTasks, id: int, db: Session=Depends(get_session),
                      user: User = Depends(get_current_user))-> None:
     item = ItemActions().get_item_by_id(db=db, id=id)
     json_user = jsonable_encoder(item).get('username')
     if item and user.username == json_user:
        try:
            db.delete(item)
            db.commit()
        except Exception as e:
            db.rollback()
            return HTTPException(status_code=400, detail=f"Something went wrong, error {e}")
        try:
            dir_to_delete = abspath(f"static/img/{user.username}/{item.name}/")
            background_tasks.add_task(delete_item_dir, path=dir_to_delete)
            redirect_url = request.url_for('get_products')
            response = RedirectResponse(redirect_url, status_code=status.HTTP_303_SEE_OTHER)
            return response
        except Exception as e:
            logger.error(f"Something went wrong, error: {e}")
            return HTTPException(status_code=400, detail=f"Something went wrong, error {e}")
     else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User is not allowed to delete this item")

@app.get("/items/{id}", status_code=status.HTTP_200_OK, response_model=schemas.ItemRead, include_in_schema=False) # http://127.0.0.1:8000/api/items?name=12
async def read_item(request: Request, id: int, db: Session=Depends(get_session), user: User = Depends(get_current_user)):
    item_db = ItemActions().get_item_by_id(db=db, id=id)
    if item_db:
        item = schemas.ItemRead.from_orm(item_db)
        item_rating = ReviewActions().get_item_reviews_rating(db=db,id=id)
        profile = ProfileActions().get_profile_by_user_id(db=db, user_id=user.id)
        if not profile:
            avatar = '/static/img/img_avatar.png'
        else:
            avatar = jsonable_encoder(profile).get('avatar')
            avatar = f"/static/img/{user.username}/profile/{avatar}"
        items = get_user_items_in_cart(db=db, user=user)
        item = jsonable_encoder(item)
        return templates.TemplateResponse("item_details.html", {"request":request,
                                                                'current_user': user.username,
                                                                'items': items,
                                                                'item': item,
                                                                'rating' : item_rating,
                                                                'avatar' : avatar,
                                                                'profile': profile})
    else:
        redirect_url = request.url_for('get_products')
        response = RedirectResponse(redirect_url, status_code=status.HTTP_303_SEE_OTHER)
        return response

@app.post("/update_product_ajax", status_code=status.HTTP_200_OK, include_in_schema=False, response_model=schemas.ItemRead)
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

@app.post("/update_description_ajax", status_code=status.HTTP_200_OK, response_model=schemas.ItemRead, include_in_schema=False)
async def update_description_ajax(request: Request, db: Session=Depends(get_session)) -> schemas.ItemRead:
    data = await request.json()
    item = ItemActions().get_item_by_id(db=db, id=data.get('id'))
    if not item:
        logger.error("Item not found")
        raise HTTPException(status_code=404, detail="Item not found")
    new_data = Item(**data).dict(exclude_unset=True, exclude_none=True)
    for key, value in new_data.items():
        setattr(item, key, value)
        db.commit()
        db.refresh(item)
    return item

@app.post("/create_review_ajax", status_code=status.HTTP_200_OK, response_model=Review, include_in_schema=False)
async def create_review_ajax(request: Request, db: Session=Depends(get_session), user: User = Depends(get_current_user)) -> Review:
    data = await request.json()
    item = ItemActions().get_item_by_id(db=db, id=data.get('item_id'))
    if not item:
        logger.error("Item not found")
        raise HTTPException(status_code=404, detail="Item not found")
    review_exist =  [item for item in item.reviews if item.created_by == user.username]
    logger.error(f"review_exist {review_exist}")
    if not review_exist:
        try:
            review = Review(**data, item=item)
            logger.info(f"Creating review {review}")
            db.add(review)
            db.commit()
            db.refresh(review)
            return review
        except Exception as e:
            db.rollback()
            return HTTPException(status_code=400, detail=f"Something went wrong, error {e}")
    logger.info('Review_exist, You can write only one review for this item')
    raise HTTPException(status_code=403, 
                        detail=f"You can write only one review for this item.",
                        headers={"X-Error": "You can write only one review for this item"},)

@app.get("/user/profile", response_model=UserRead,status_code= status.HTTP_200_OK, include_in_schema=False)
async def get_user_profile( request: Request, db: Session=Depends(get_session), user: User = Depends(get_current_user)):
    profile = ProfileActions().get_profile_by_user_id(db=db, user_id=user.id)
    if not profile:
        avatar = '/static/img/img_avatar.png'
    else:
      avatar = jsonable_encoder(profile).get('avatar')
      avatar = f"/static/img/{user.username}/profile/{avatar}"
    return templates.TemplateResponse("profile.html", {"request": request,
                                                       'current_user': user.username,
                                                       'profile': profile,
                                                        'avatar': avatar})

@app.post("/create_profile", status_code=status.HTTP_201_CREATED, include_in_schema=False)
@app.post("/user/create_profile", status_code=status.HTTP_201_CREATED,  include_in_schema=False)
async def create_profile(request: Request, db: Session = Depends(get_session), user: User = Depends(get_current_user)):
    form_data = await request.form()
    filename = form_data['file'].filename
    file = form_data['file']
    email = form_data.get('email')
    number = form_data.get('number')
    address = form_data.get('address')
    primary_email = form_data.get('primary_email')
    query = select(User).where(User.username == user.username)
    user_db = db.exec(query).first()
    if user_db:
        try:
            IMG_DIR = os.path.join(PROJECT_ROOT, f'static/img/{user.username}/profile')
            content = await file.read()
            if not os.path.exists(IMG_DIR):
                os.makedirs(IMG_DIR, exist_ok=True)
            with open(f"static/img/{user.username}/profile/{filename}", 'wb') as f:
                f.write(content)
        except Exception as e:
            logger.error(f"Something went wrong, error: {e}")
        user_profile = UserProfile(profile_id=user.id,
                                   email=email,
                                   number=number,
                                   primary_email=primary_email,
                                   address=address,
                                   avatar=filename)
        try:
            db.add(user_profile)
            db.commit()
            db.refresh(user_profile)
        except Exception as e:
            db.rollback()
            return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Something went wrong, error {e}")
    return user_profile

@app.post("/update_profile", status_code=status.HTTP_200_OK, include_in_schema=False)
@app.post("/user/update_profile", status_code=status.HTTP_200_OK, include_in_schema=False)
async def update_profile(request: Request, db: Session = Depends(get_session), user: User = Depends(get_current_user)):
    form_data = await request.form()
    json_data = dict(form_data)
    for k, v in json_data.items():
        if v == '':
            json_data[k] = None
    filename = form_data['file'].filename
    db_profile = ProfileActions().get_profile_by_user_id(db=db, user_id=user.id)
    if db_profile is None:
        raise HTTPException(status_code=404, detail=f"No profile with user_id: {user.id} found")
    query = select(User).where(User.username == user.username)
    user_db = db.exec(query).first()
    if user_db:
        try:
            if form_data['file'].filename:
                content = await form_data['file'].read()
                with open(f"static/img/{user.username}/profile/{form_data['file'].filename}", 'wb') as f:
                    f.write(content)
        except Exception as e:
            logger.error(f"Something went wrong, error: {e}")
        new_data = UserProfile(**dict(json_data), user=user, avatar=filename if filename else None).dict(exclude_unset=True,
                                                                                                          exclude_none=True)
        for key, value in new_data.items():
            setattr(db_profile, key, value)
            db.commit()
            db.refresh(db_profile)
    json_compatible_item_data = jsonable_encoder(db_profile)
    return JSONResponse(content=json_compatible_item_data)
    # return templates.TemplateResponse("profile.html", {"request": request,
    #                                                    'current_user': user.username,
    #                                                    'profile': db_profile })

@app.get("/categories", status_code=status.HTTP_200_OK, include_in_schema=False)
async def get_category(request: Request,  db: Session = Depends(get_session), user: User = Depends(get_current_user)):
    category = CategoryActions().get_category_by_name(db=db, name='TV')
    return templates.TemplateResponse("categories.html", {"request": request,
                                                          'current_user': user.username,
                                                          'items': category.items})

@app.post("/category", status_code=status.HTTP_200_OK, response_model=schemas.ItemRead, include_in_schema=False)
async def get_category_ajax( request: Request, db: Session=Depends(get_session), user: User = Depends(get_current_user)):
    data = await request.json()
    category = CategoryActions().get_category_by_name(db=db, name=data.get('category'))
    json_compatible_item_data = jsonable_encoder(category.items)
    if json_compatible_item_data:
        return JSONResponse(content = json_compatible_item_data)
    return JSONResponse(content = "No Items in Category Found")

@app.post("/update-basket", status_code=status.HTTP_200_OK,  include_in_schema=False)
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

@app.post("/user/remove-from-basket", status_code=status.HTTP_200_OK,  include_in_schema=False)
async def remove_from_basket(request: Request, db: Session = Depends(get_session), user: User = Depends(get_current_user)):
    data = await request.json()
    item = ItemActions().get_item_by_id(db=db, id=data.get('item_id'))
    new_dict = {user.username: {"in_cart": False}}
    basket = dict(item.in_cart, **new_dict )
    item.in_cart = basket
    db.commit()
    db.refresh(item)
    return item

@app.get("/user_items_in_cart", status_code=status.HTTP_200_OK, include_in_schema=True)
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

# To remove as not needed
@app.get("/items-in-cart", status_code=status.HTTP_200_OK, include_in_schema=False)
async def get_items_in_cart(request: Request, db: Session=Depends(get_session), user: User = Depends(get_current_user)):
    items = ItemActions().get_items(db=db)
    items_in_cart =  [item for item in items for k, v in item.in_cart.items()
                      if k == user.username and v['in_cart'] == True]
    profile = ProfileActions().get_profile_by_user_id(db=db, user_id=user.id)
    if not profile:
        avatar = '/static/img/img_avatar.png'
    else:
      avatar = jsonable_encoder(profile).get('avatar')
      avatar = f"/static/img/{user.username}/profile/{avatar}"
    total = sum([item.price for item in items_in_cart])
    return templates.TemplateResponse("cart.html",  {"request":request,
                                                     'items': items_in_cart,
                                                     'items_in_cart': len(items_in_cart),
                                                     'total': ("%.2f" % total),
                                                     'current_user': user.username,
                                                     'profile': profile,
                                                     'avatar':avatar})