from fastapi import APIRouter, status, Form
from fastapi import Request, Depends, HTTPException
from fastapi.responses import JSONResponse
from src.db import get_session
from sqlalchemy.orm import Session
from src.crud.crud import CategoryActions, CartActions, Item, User
from src.schemas import CategoryCreate, CategoryItems, CategoryRead
from src.models import Category
from src.auth.oauth import get_current_user
from src.my_logger import detailed_logger

PROTECTED = [Depends(get_current_user)]

cart_router = APIRouter(prefix='/api/cart', tags=["cart"], dependencies=PROTECTED,
                            responses={404: {"description": "Not found"}},)

logger = detailed_logger()

@cart_router.get("/{id}", status_code=status.HTTP_200_OK, response_model=Cart, include_in_schema=True)
def get_basket_by_id(request: Request, id: int, db: Session = Depends(get_session)):
    """ Return basket by given id"""
    cart = CartActions().get_cart_by_id(db=db, id=id)
    print('cart content:', cart.content)
    if cart is None:
        raise HTTPException(status_code=404, detail=f"No cart with id {id} found")
    return cart

@cart_router.get("/", status_code=status.HTTP_200_OK, response_model=list[Cart], include_in_schema=True)
def get_baskets(request: Request, db: Session = Depends(get_session)):
    """ Return all baskets """
    baskets = CartActions().get_carts(db=db)
    if baskets is None:
        logger.info("No baskets found")
        raise HTTPException(status_code=404, detail=f"No baskets found")
    return baskets

@cart_router.post("/basket", status_code=status.HTTP_201_CREATED, response_model=Cart, include_in_schema=True)
def create_basket(request: Request, item: Item,  db: Session = Depends(get_session), user: User = Depends(get_current_user)):
    """ Return all categories """
    basket = CartActions().create_basket(db=db, user=user, item=item)
    return basket