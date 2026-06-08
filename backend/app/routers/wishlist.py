from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.wishlist import Wishlist
from app.schemas.wishlist import WishlistCreate, WishlistOut
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/wishlist", tags=["Wishlist"])

@router.get("", response_model=List[WishlistOut])
def get_wishlist(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Wishlist).filter(Wishlist.user_id == user.id).all()

@router.post("", response_model=WishlistOut)
def add_to_wishlist(payload: WishlistCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    existing = db.query(Wishlist).filter(Wishlist.user_id == user.id, Wishlist.product_id == payload.product_id).first()
    if existing: return existing
    w = Wishlist(user_id=user.id, product_id=payload.product_id)
    db.add(w); db.commit(); db.refresh(w)
    return w

@router.delete("/{product_id}")
def remove_from_wishlist(product_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    w = db.query(Wishlist).filter(Wishlist.user_id == user.id, Wishlist.product_id == product_id).first()
    if not w: raise HTTPException(404, "Not found")
    db.delete(w); db.commit()
    return {"message": "Removed"}
