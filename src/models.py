
import datetime
from datetime import date
import decimal
from pydantic import BaseModel
from typing import Optional, Union
from sqlmodel import SQLModel, Field, Relationship, Column, VARCHAR
from typing import Optional, List
import datetime
import uuid

class Category(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(sa_column=Column("name", VARCHAR, unique=True))
    items: Optional[List['Item']] = Relationship(back_populates='category')
    class Config:
        schema_extra = {
            "example": {
                "name": "Category-1",
              }
            }
class Item(SQLModel, table=True):
    id:           Optional[int] = Field(default=None, primary_key=True)
    name:         Optional[str] = Field(default=None, unique=True)
    product_code: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, nullable=False)
    date:         Optional[datetime.datetime] = Field(default=datetime.datetime.now().replace(microsecond=0), nullable=False)
    price:        Optional[decimal.Decimal]
    image:        Optional[str]
    comments:     Optional[List['Comment']] = Relationship(back_populates='item')
    category_id:  Optional[int] = Field(default=None, foreign_key="category.id")
    category:     Optional['Category'] = Relationship(back_populates='items')
    class Config:
        schema_extra = {
        "example": {
            "name": "Item-Name",
            "price": 12.12,
           }
        }



class Comment(SQLModel, table=True):
    id:           Optional[int]    = Field(default=None, primary_key=True)
    text:         Optional[str]    = Field(default=None)
    item:         Optional['Item'] = Relationship(back_populates='comments')
    item_id:      Optional[int]    = Field(default=None, foreign_key="item.id")
    # item_id:      Optional[int] = Relationship(back_populates='comments')
