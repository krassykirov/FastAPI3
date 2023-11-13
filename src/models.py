
import datetime
from datetime import date
import decimal
from pydantic import BaseModel
from typing import Optional, Union
from sqlmodel import SQLModel, Field, Relationship, Column, VARCHAR
from typing import Optional, List
import datetime


class Category(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(sa_column=Column("name", VARCHAR, unique=True))
    events: Optional[List['Event']] = Relationship(back_populates='category')
    # class Config:
    #     schema_extra = {
    #         "example": {
    #             "name": "Category-1",
    #           }
    #         }


class Event(SQLModel, table=True):
    id:           Optional[int] = Field(default=None, primary_key=True)
    product_code: Optional[str] = Field(sa_column=Column("product_code", VARCHAR, unique=True))
    date:         Optional[datetime.datetime]
    price:        Optional[decimal.Decimal]
    category_id:  Optional[int] = Field(default=None, foreign_key="category.id")
    category:     Optional['Category'] = Relationship(back_populates='events')
    # class Config:
    #     schema_extra = {
    #     "example": {
    #         "product_code": "12345",
    #         "date": "2023-11-12",
    #         "price": 12.12,
    #         "category_id": 1
    #        }
    #     }


