from pydantic import BaseModel
import datetime
from typing import List, Optional
from src.models import Item, Category
import decimal

class Category(BaseModel):
    name: str
    id: int
    events: Optional[List[Item]]
    class Config:
        orm_mode = True

class CategoryEvents(BaseModel):
    name: str
    events: Optional[List[Item]]
    class Config:
        orm_mode = True

class ItemRead(BaseModel):
    id:   Optional[int]
    name: Optional[str]
    date: Optional[datetime.datetime]
    price: Optional[decimal.Decimal]
    image: Optional[str]
    username: Optional[str]
    reviews: Optional[List]
    description:  Optional[str]
    class Config:
        orm_mode = True
        schema_extra = {
        "example": {
            "id":1,
            "name": "Item-Name",
            "price": 99.99,
            "date": "2023-11-22 13:50:51",
            "image": "image.pgn",
            "username": "Krassy",
            "description": "description"
           }
        }

class ItemUpdate(BaseModel):
    price: Optional[decimal.Decimal]
    description:  Optional[str]
    class Config:
        orm_mode = True
        schema_extra = {
        "example": {
            "price": 99.99,
             "description": "description"
           }
        }
class ItemCreate(BaseModel):
    name: Optional[str]
    price: Optional[decimal.Decimal]
    description:  Optional[str]
    username: Optional[str]
    class Config:
        orm_mode = True
        schema_extra = {
        "example": {
            "name": "Item-Name",
            "price": 99.99,
            "description": "description"
           }
        }
