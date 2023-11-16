from fastapi import Depends, HTTPException, Request, APIRouter, status, Form
from fastapi.responses import RedirectResponse
from starlette.datastructures import URL
from src.db import get_session
from sqlalchemy.orm import Session
from sqlalchemy import select
from pathlib import Path
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlmodel import SQLModel, Session
from src.db import engine
from src.routers.categories import category_router
from src.routers.items import items_router
from src.models import Item, Category
from src.crud import CategoryActions, ItemActions
import json 

PROJECT_ROOT = Path(__file__).parent.parent

app = FastAPI()
app.include_router(category_router)
app.include_router(items_router)
templates = Jinja2Templates(directory="src/templates")

@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

@app.get("/", include_in_schema=False)
async def home(request: Request):
    return templates.TemplateResponse("base.html", {"request": request})

@app.get("/test", include_in_schema=False)
async def home_js(request: Request):
    return templates.TemplateResponse("catalog.html", {"request": request})

@app.post("/create_cat", status_code=status.HTTP_201_CREATED, response_model=Category, include_in_schema=False)
async def create_cat(request: Request, db: Session = Depends(get_session)):
    """ Create category """
    form_data = await request.form()
    print('form_data:', form_data)
    c = CategoryActions().get_category_by_name(db=db, name=form_data.get('name'))
    if c is not None:
        raise HTTPException(status_code=404, detail=f"Category with name:'{c.name}' already exist")
    category = CategoryActions().create_category(db=db, category=Category(name=form_data.get('name')))
    return  templates.TemplateResponse("base.html", {"request":request, 'category': category})

@app.post("/api/data")
def get_data(request: Request, db: Session = Depends(get_session)):
    # events = EventActions().create_event(db=db)
    return {'name':"test"}

# @app.get("/items/", response_model=list[Item])
# def get_all_events(request: Request, db: Session = Depends(get_session)):
#     items = ItemActions().get_items(db=db)
#     return templates.TemplateResponse("catalog.html", {"request": request, 'items': items})


app.mount("/static", StaticFiles(directory="src/static", html=True))