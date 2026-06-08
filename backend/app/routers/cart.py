from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.cart import CartItem
from app.models.product import Product
from app.schemas.cart import CartItemCreate, CartItemUpdate, CartItemOut
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/cart", tags=["Cart"])

@router.get("", response_model=List[CartItemOut])
def get_cart(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(CartItem).filter(CartItem.user_id == user.id).all()

@router.post("", response_model=CartItemOut)
def add_to_cart(payload: CartItemCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == payload.product_id).first()
    if not product: raise HTTPException(404, "Product not found")
    item = db.query(CartItem).filter(CartItem.user_id == user.id, CartItem.product_id == payload.product_id).first()
    if item:
        item.quantity += payload.quantity
    else:
        item = CartItem(user_id=user.id, product_id=payload.product_id, quantity=payload.quantity)
        db.add(item)
    db.commit(); db.refresh(item)
    return item

@router.put("/{item_id}", response_model=CartItemOut)
def update_cart(item_id: int, payload: CartItemUpdate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.user_id == user.id).first()
    if not item: raise HTTPException(404, "Not found")
    item.quantity = payload.quantity
    db.commit(); db.refresh(item)
    return item

@router.delete("/{item_id}")
def remove_from_cart(item_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.user_id == user.id).first()
    if not item: raise HTTPException(404, "Not found")
    db.delete(item); db.commit()
    return {"message": "Removed"}
