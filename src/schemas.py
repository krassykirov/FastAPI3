from pydantic import BaseModel
import datetime
import decimal
from typing import List, Optional
from src.models import Event, Category

class Category(BaseModel):
    name: str
    # events: Optional[List[Event]] # to fix showing the events
    class Config:
        orm_mode = True

class CategoryEvents(BaseModel):
    name: str
    events: Optional[List[Event]] # to fix showing the events
    class Config:
        orm_mode = True

class Event(BaseModel):
    product_code: str
    date: datetime.datetime
    price: decimal.Decimal
    # category_id: int
    category: Optional[Category]

    class Config:
        orm_mode = True


