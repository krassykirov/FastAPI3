from fastapi import Depends, HTTPException, Request, APIRouter, status, Form, BackgroundTasks
from fastapi.responses import RedirectResponse
from src.db import get_session
from sqlalchemy.orm import Session
from sqlalchemy import select
from pathlib import Path
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import JSONResponse,RedirectResponse
from sqlalchemy.orm import Session
from sqlmodel import SQLModel, Session
from src.db import engine
from src.routers.categories import category_router
from src.routers.items import items_router
from src.routers.comments import comments_router
from src.models import Item, Category, Comment
from src.crud.crud import CategoryActions, ItemActions, CommentActions
import src.schemas
import json, os, shutil
from os.path import abspath
import decimal

PROJECT_ROOT = Path(__file__).parent.parent

app = FastAPI()
app.include_router(category_router)
app.include_router(items_router)
app.include_router(comments_router)
templates = Jinja2Templates(directory="src/templates")

@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

@app.get("/", include_in_schema=False)
async def home(request: Request):
    return templates.TemplateResponse("base.html", {"request": request})

@app.post("/create_cat", status_code=status.HTTP_201_CREATED, response_model=Category, include_in_schema=False)
async def create_cat(request: Request, name: str, db: Session = Depends(get_session)):
    """ Create category """
    # form_data = await request.form()
    # print('form_data:', form_data)
    print('name:', name)
    # c = CategoryActions().get_category_by_name(db=db, name=form_data.get('name'))
    # if c is not None:
    #     raise HTTPException(status_code=404, detail=f"Category with name:'{c.name}' already exist")
    # category = CategoryActions().create_category(db=db, category=Category(name=form_data.get('name')))
    # return  templates.TemplateResponse("base.html", {"request":request, 'category': category})

@app.get("/details")
@app.get("/items/details")
def get_details(request: Request, db: Session = Depends(get_session)):
    items = ItemActions().get_items(db=db)
    return templates.TemplateResponse("items.html", {"request":request, 'items': items})

@app.post("/create_item", include_in_schema=False)
@app.post("/items/create_item", include_in_schema=False)
async def create_item(request: Request, db: Session = Depends(get_session)):
        form_data = await request.form()
        file = form_data['file']
        filename = form_data['file'].filename
        item_name =form_data['name']
        price=form_data['price']
        query = db.query(Item).where(Item.name == item_name).all()
        item = [item for item in query]
        items = ItemActions().get_items(db=db)
        if item:
            print(f"item with that name already exists!")
            return templates.TemplateResponse("items.html", {"request":request, 'items':items,
                                                                   'message': "Item with that name already exists!"})
        IMG_DIR = os.path.join(PROJECT_ROOT, 'src/static/img/')
        content = await file.read()
        path = os.path.join(IMG_DIR, item_name)
        if not os.path.exists(path):
               os.makedirs(path,exist_ok=True)
        with open(f"src/static/img/{item_name}/{filename}", 'wb') as f:
            f.write(content)
            item = Item(name=item_name, price=price, image=filename)
        db.add(item)
        db.commit()
        redirect_url = request.url_for('get_details')
        response = RedirectResponse(redirect_url, status_code=status.HTTP_303_SEE_OTHER)
        return response

@app.post("/delete_item")
@app.post("/items/delete_item")
async def delete_item(request: Request, background_tasks: BackgroundTasks, id: int=Form(None), db: Session=Depends(get_session))-> None:
     item = db.query(Item).where(Item.id == id).first()
     if item:
        db.delete(item)
        db.commit()
        try:
            dir_to_delete = abspath(f"src/static/img/{item.name}/")
            background_tasks.add_task(delete_item_dir, path=dir_to_delete)
            print("Notification sent in the background")
            redirect_url = request.url_for('get_details')
            response = RedirectResponse(redirect_url, status_code=status.HTTP_303_SEE_OTHER)
            return response
        except Exception as e:
            print(f"Something went wrong, error: {e}")
            return HTTPException(status_code=400, detail=f"Something went wrong, error {e}")
     else:
        raise HTTPException(status_code=404,detail=f"No item with id={id}")

@app.get("/items/{id}") # http://127.0.0.1:8000/api/items?name=12
async def read_item(request: Request, id: int, db: Session=Depends(get_session)):
    item = ItemActions().get_item_by_id(db=db, id=id)
    # item =  db.get(Item, id)
    return templates.TemplateResponse("item_details.html", {"request":request, 'item': item})

# Update with Form
# @app.post("/update_item", include_in_schema=False)
# @app.post("/items/update_item", include_in_schema=False)
# def update_item(request: Request, id: int = Form(None), price: int=Form(None), db:Session=Depends(get_session)):
#     item = db.get(Item, id)
#     if not item:
#         raise HTTPException(status_code=404, detail="Item not found")
#     new_data = Item(id=id, price=price).dict(exclude_unset=True)
#     for key, value in new_data.items():
#         setattr(item, key, value)
#         db.commit()
#     redirect_url = request.url_for('read_item', id=item.id)
#     response = RedirectResponse(redirect_url, status_code=status.HTTP_303_SEE_OTHER)
#     return response

@app.post("/update_item_ajax", include_in_schema=False, response_model=src.schemas.Item)
async def update_item_api(request: Request, db: Session=Depends(get_session)):
    data = await request.json()
    id = data.get('id')
    price = data.get('price')
    item = ItemActions().get_item_by_id(db=db, id=id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    new_data = Item(id=id, price=price).dict(exclude_unset=True)
    for key, value in new_data.items():
        setattr(item, key, value)
        db.commit()
        db.refresh(item)
    return item

@app.post("/comment_ajax", status_code=status.HTTP_201_CREATED, include_in_schema=False)
async def create_comment(request: Request, db: Session=Depends(get_session)):
    data = await request.json()
    item_id = data.get('item_id')
    text = data.get('text')
    item = ItemActions().get_item_by_id(db=db, id=item_id)
    comment = Comment(text=text, item=item, item_id=item.id)
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment

@app.post("/comment", status_code=status.HTTP_201_CREATED, include_in_schema=True)
async def create_comment(request: Request, text:str, item_id: int, db: Session=Depends(get_session)):
    item = ItemActions().get_item_by_id(db=db, id=item_id)
    comment = Comment(text=text, item=item, item_id=item.id)
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment

# @app.get("/get-comment", status_code=status.HTTP_201_CREATED, include_in_schema=True)
# async def get_comments(request: Request, db: Session=Depends(get_session)):
#     comments = db.query(Comment).all()
#     return comments

def delete_item_dir(path):
    try:
        print(f"Deleting item directory: {path}")
        shutil.rmtree(path) # onerror={'error'}
    except OSError as e:
        print(f"Error deleting the directory: {path}, {e}")
    except Exception as e:
        print(f"Something went wrong, error: {e}")
    return True

app.mount("/static", StaticFiles(directory="src/static", html=True))