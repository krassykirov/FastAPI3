import datetime
from datetime import date
import decimal
from pydantic import BaseModel
from typing import Optional, Union
from sqlmodel import SQLModel, Field, Relationship, Column, VARCHAR
from typing import Optional, List
import datetime
import uuid
from src.auth.oauth import pwd_context

class Token(BaseModel):
    access_token: str
    token_type: str
class TokenData(BaseModel):
    username: Union[str, None] = None
    expires: Optional[datetime.datetime]

class User(SQLModel, table=True):
    id: int = Field(primary_key=True,default=None)
    username: Optional[str]= Field(sa_column=Column("username", VARCHAR, unique=True, index=True))
    password_hash: str = ""
    items: List['Item'] = Relationship(sa_relationship_kwargs={"cascade": "delete"}, back_populates="owner")
    reviews: List['Review'] = Relationship(sa_relationship_kwargs={"cascade": "delete"}, back_populates="user")
    def set_password(self,password):
        self.password_hash = pwd_context.hash(password)
    def verify_password(self,password):
        return pwd_context.verify(password,self.password_hash)

class UserRead(SQLModel):
    id: int
    username: Optional[str]

class Item(SQLModel, table=True):
    id:           Optional[int] = Field(default=None, primary_key=True)
    name:         Optional[str] = Field(default=None, unique=True)
    product_code: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, nullable=False)
    date:         Optional[datetime.datetime] = Field(default=datetime.datetime.now().replace(microsecond=0), nullable=False)
    price:        Optional[decimal.Decimal]
    image:        Optional[str] = Field(default="no-image.png")
    reviews:      Optional[List['Review']] = Relationship(sa_relationship_kwargs={"cascade": "delete"}, back_populates='item')
    category_id:  Optional[int] = Field(default=None, foreign_key="category.id")
    category:     Optional['Category'] = Relationship(back_populates='items')
    owner:        Optional[User] = Relationship(back_populates="items")
    username:     Optional[str] = Field(default=None, foreign_key="user.username")
    description:  Optional[str]

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

class Review(SQLModel, table=True):
    id:           Optional[int]    = Field(default=None, primary_key=True)
    text:         Optional[str]    = Field(default=None)
    item:         Optional['Item'] = Relationship(back_populates='reviews')
    item_id:      Optional[int]    = Field(default=None, foreign_key="item.id")
    rating:       Optional[int]    = Field(default=None)
    created_by:   Optional[str]    = Field(default=None, foreign_key="user.username")
    user:         Optional['User'] = Relationship(back_populates='reviews')