from fastapi import Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pathlib import Path
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from sqlmodel import SQLModel, Session
from db import engine
from routers.categories import category_router
from routers.items import items_router
from routers.reviews import reviews_router
from routers.profile import profile_router
# from src.routers.cart import cart_router
from auth.oauth import oauth_router, get_current_user
from models import Category, Categories
from os.path import abspath
from my_logger import detailed_logger
from datetime import datetime, timedelta
# from prometheus_fastapi_instrumentator import Instrumentator

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
    "https://agreeable-glacier-022fe8c03.4.azurestaticapps.net",
    "https://agreeable-glacier-022fe8c03-preview.westeurope.4.azurestaticapps.net"
]

# instrumentator = Instrumentator().instrument(app)

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
    # instrumentator.expose(app)


@app.get("/static/img/{image_path:path}", include_in_schema=False)
async def get_image(image_path: str):
    full_image_path = f"static/img/{image_path}"
    with open(full_image_path, "rb") as file:
        image_content = file.read()
    response = Response(content=image_content)
    response.headers["Cache-Control"] = "max-age=604800"
    response.headers["Expires"] = (datetime.utcnow() + timedelta(hours=168)).strftime("%a, %d %b %Y %H:%M:%S GMT")
    return response

def create_categories(engine):
    with Session(engine) as session:
        cat = session.query(Category).all()
        if not cat:
            for c in Categories:
                category = Category(name=c)
                session.add(category)
            session.commit()
            session.refresh(category)
