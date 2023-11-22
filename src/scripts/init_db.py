import os
import datetime
from src.models import Item, Category
from sqlmodel import SQLModel, Session, create_engine


engine = create_engine(
    os.getenv('SQLALCHEMY_DATABASE_URL',"sqlite:///events.db"),
    connect_args={"check_same_thread": False},  # Needed for SQLite
    echo=True # Log generated SQL
)

if __name__ == "__main__":
    print("Creating tables (if necessary)")
    SQLModel.metadata.create_all(engine)

    print("--------")

    print("This script will create a Category and Event tables save it in the database.")

    with Session(engine) as session:
        category = Category(name="Category-1")
        session.add(category)
        session.commit()
        item = Item(product_code="12345", date=datetime.datetime.now(), price="12.12", category=category)
        session.add(item)
        session.commit()
