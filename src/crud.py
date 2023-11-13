from sqlalchemy.orm import Session
from src.models import Event, Category
import src.schemas
import datetime

# Events
class EventActions:
    def get_event_by_id(self, db: Session, id: int):
        event = db.query(Event).filter(Event.id == id).first()
        return event

    def get_events(self, db: Session, skip: int = 0, limit: int = 100):
        events = db.query(Event).offset(skip).limit(limit).all()
        return events

    def create_event(self, db: Session, event: src.schemas.Event):
        db.add(event)
        db.commit()
        return event

    def delete_event_by_id(self, db: Session, id: int):
        event = db.query(Event).filter(Event.id == id).first()
        if event:
            db.delete(event)
            db.commit()

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






