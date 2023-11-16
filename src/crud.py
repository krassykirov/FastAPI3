from sqlalchemy.orm import Session
from src.models import Item, Category
import src.schemas
import datetime

# Events
class ItemActions:
    def get_item_by_id(self, db: Session, id: int):
        item = db.query(Item).filter(Item.id == id).first()
        return item

    def get_item_by_name(self, db: Session, name: str):
        item = db.query(Item).filter(Item.name == name).first()
        return item

    def get_items(self, db: Session, skip: int = 0, limit: int = 100):
        items = db.query(Item).offset(skip).limit(limit).all()
        return items

    def delete_item_by_id(self, db: Session, id: int):
        item = db.query(Item).filter(Item.id == id).first()
        if item:
            db.delete(item)
            db.commit()

    def create_item(self, db: Session, item: src.schemas.Item):
        db.add(item)
        db.commit()
        return item

class CategoryActions:

    def get_category_by_id(self, db: Session, id: int):
        category = db.query(Category).filter(Category.id == id).first()
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
        category = db.query(Category).filter(Category.id == id).first()
        if category:
            db.delete(category)
            db.commit()






