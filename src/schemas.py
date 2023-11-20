from pydantic import BaseModel
import datetime
import decimal
from typing import List, Optional
from src.models import Item, Category
import uuid
class Category(BaseModel):
    name: str
    id: int
    # events: Optional[List[Item]] # to fix showing the events
    class Config:
        orm_mode = True

class CategoryEvents(BaseModel):
    name: str
    events: Optional[List[Item]] # to fix showing the events
    class Config:
        orm_mode = True

class Item(BaseModel):
    # id: Optional[int]
    name: str
    price: Optional[decimal.Decimal]
    # comments: Optional[List]
    class Config:
        orm_mode = True

class Comment(BaseModel):

    text:    Optional[str]
    item_id: Optional[int]
    class Config:
        orm_mode = True


