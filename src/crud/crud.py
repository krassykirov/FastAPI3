from sqlalchemy.orm import Session
from src.models import Item, Category, Comment
import src.schemas
import datetime

# Events
class ItemActions:
    def get_item_by_id(self, db: Session, id: int):
        # item = db.query(Item).filter(Item.id == id).first()
        item = db.get(Item, id)
        return item

    def get_item_by_name(self, db: Session, name: str):
        item = db.query(Item).filter(Item.name == name).first()
        return item

    def get_items(self, db: Session, skip: int = 0, limit: int = 100, user= None):
        if user:
            items = db.query(Item).filter(Item.username==user).offset(skip).limit(limit).all()
            return items
        items = db.query(Item).offset(skip).limit(limit).all()
        return items

    def delete_item_by_id(self, db: Session, id: int):
        # item = db.query(Item).filter(Item.id == id).first()
        item = db.get(Item, id)
        if item:
            db.delete(item)
            db.commit()

    def create_item(self, db: Session, item: Item):
        db.add(item)
        db.commit()
        db.refresh(item)
        return item

class CategoryActions:

    def get_category_by_id(self, db: Session, id: int):
        # category = db.query(Category).filter(Category.id == id).first()
        category = db.get(Category, id)
        return category

    def get_category_by_name(self, db: Session, name: str):
        category = db.query(Category).filter(Category.name == name).first()
        return category

    def get_categories(self, db: Session, skip: int = 0, limit: int = 100):
        categories = db.query(Category).offset(skip).limit(limit).all()
        return categories

    def create_category(self, db: Session, category: src.schemas.Category):
        db.add(category)
        db.commit()
        return category

    def delete_category(self, db: Session, id: int):
        # category = db.query(Category).filter(Category.id == id).first()
        category = db.get(Category, id)
        if category:
            db.delete(category)
            db.commit()

class CommentActions:

     def get_comment_by_id(self, db: Session, id: int):
        # comment = db.query(Comment).filter(Comment.id == id).first()
        comment = db.get(Comment, id)
        return comment

     def get_item_comments(self, db: Session, item_id: int):
        item = ItemActions().get_item_by_id(db=db, id=item_id)
        comments = item.comments
        return comments
