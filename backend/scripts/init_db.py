import json
from sqlmodel import SQLModel, Session, create_engine
from models import Item, User, Categories, Category, UserProfile, Review
import os

engine = create_engine(
    os.getenv('SQLALCHEMY_DATABASE_URL',"sqlite:///backend.db"),
    connect_args={"check_same_thread": False},  # Needed for SQLite
    echo=True # Log generated SQL
)
# Prerequisites
# UPDATE item
# SET discount_price = ROUND((price - price * COALESCE(discount, 0)), 2);
# for item in items_db:
#    item.update_discount()
# UPDATE item SET liked = '{}'; && UPDATE item SET in_cart = '{}';  As they are NULL in DB
if __name__ == "__main__":
    print("Creating tables (if necessary)")
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        cat = session.query(Category).all()
        if not cat:
            for c in Categories:
                category = Category(name=c)
                session.add(category)
            session.commit()
            session.refresh(category)
    f = open('category.json')
    data = json.load(f)
    with Session(engine) as session:
        for item_data in data:
            item = User(**item_data)
            session.add(item)
        session.commit()
    f = open('item.json')
    data = json.load(f)
    with Session(engine) as session:
        for item_data in data:
            item = Item(**item_data)
            session.add(item)
        session.commit()
    # f = open('userprofile.json')
    # data = json.load(f)
    # with Session(engine) as session:
    #     for item_data in data:
    #         item = UserProfile(**item_data)
    #         session.add(item)
    #     session.commit()
    # f = open('review.json')
    # data = json.load(f)
    # with Session(engine) as session:
    #     for item_data in data:
    #         item = Review(**item_data)
    #         session.add(item)
    #     session.commit()
