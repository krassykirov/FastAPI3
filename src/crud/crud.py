from sqlalchemy.orm import Session
from src.models import Item, Category, Review, UserProfile
import src.schemas

# Events
class ItemActions:
    def get_item_by_id(self, db: Session, id: int):
        item = db.query(Item).filter(Item.id == id).first()
        # item = db.get(Item, id)
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
        item = self.get_item_by_id(db=db, id=id)
        if item:
            db.delete(item)
            db.commit()

    def create_item(self, db: Session, item: Item):
        db.add(item)
        db.commit()
        db.refresh(item)
        return item

    def update_item(self, id: int, db: Session, item: src.schemas.ItemUpdate):
        item_exist = self.get_item_by_id(db=db, id=id)
        if not item_exist:
            return "Item not found"
        new_data = Item(**dict(item), id=item_exist).dict(exclude_unset=True, exclude_none=True)
        print("new_data:", new_data)
        for key, value in new_data.items():
            setattr(item, key, value)
            db.commit()
            db.refresh(item)
        return item

    # def get_item_rating(self, id: int, db: Session):
    #     item = self.get_item_by_id(db=db,id=id)
    #     result = [item.rating for item in item.reviews]
    #     print('result:', result)
    #     if result:
    #         rating = sum(result) / len(result)
    #         print('result round:', rating, round(rating))
    #         return round(rating)
    #     return 0

class CategoryActions:

    def get_category_by_id(self, db: Session, id: int):
        category = db.query(Category).filter(Category.id == id).first()
        # category = db.get(Category, id)
        return category

    def get_category_by_name(self, db: Session, name: str):
        category = db.query(Category).filter(Category.name == name).first()
        return category

    def get_categories(self, db: Session, skip: int = 0, limit: int = 100):
        categories = db.query(Category).offset(skip).limit(limit).all()
        return categories

    def create_category(self, db: Session, category: Category):
        db.add(category)
        db.commit()
        db.refresh(category)
        return category

    def delete_category(self, db: Session, id: int):
        category = db.query(Category).filter(Category.id == id).first()
        # category = db.get(Category, id)
        if category:
            db.delete(category)
            db.commit()

class ReviewActions:

     def get_review_by_id(self, db: Session, id: int):
        comment = db.query(Review).filter(Review.id == id).first()
        # comment = db.get(Review, id)
        return comment

     def get_item_reviews(self, db: Session, id: int):
        item = ItemActions().get_item_by_id(db=db, id=id)
        if item:
            reviews = item.reviews
            return reviews
        return None

     def get_item_reviews_rating(self, id: int, db: Session):
        reviews = self.get_item_reviews(db=db, id=id)
        result = [item.rating for item in reviews if item.rating]
        if result:
            rating = sum(result) / len(result)
            return {'rating':round(rating), 'review_number': len(result), 'rating_float': sum(result) / len(result) }
        return {'rating':0, 'review_number': 0, 'rating_float': 0 }

class ProfileActions:

    def get_profile_by_user_id(self, db: Session, user_id: int):
        profile = db.query(UserProfile).filter(UserProfile.profile_id == user_id).first()
        return profile

    # def update_profile_by_user_id(self, db: Session, user_id: int, profile: UserProfile, user: User = Depends(get_current_user)):
    #      db_profile = ProfileActions().get_profile_by_user_id(db=db, user_id=user_id)
    #      if db_profile is None:
    #             raise {f"No profile with user_id: {user_id} found"}
    #      new_data = UserProfile(**dict(profile), user=user).dict(exclude_unset=True)
    #      print("new_data:", new_data)
    #      for key, value in new_data.items():
    #         setattr(db_profile, key, value)
    #         db.commit()
    #         db.refresh(db_profile)
    #      return db_profile

    def delete_profile_by_user_id(self, db: Session, user_id: int):
        profile = db.query(UserProfile).filter(UserProfile.profile_id == user_id).first()
        if profile:
            db.delete(profile)
            db.commit()


