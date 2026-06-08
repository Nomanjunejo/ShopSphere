from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.review import Review
from app.schemas.review import ReviewCreate, ReviewUpdate, ReviewOut
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/reviews", tags=["Reviews"])

def serialize(r: Review):
    return {
        "id": r.id, "user_id": r.user_id, "product_id": r.product_id,
        "rating": r.rating, "comment": r.comment, "created_at": r.created_at,
        "user_name": r.user.name if r.user else None,
    }

@router.get("/product/{product_id}", response_model=List[ReviewOut])
def product_reviews(product_id: int, db: Session = Depends(get_db)):
    reviews = db.query(Review).filter(Review.product_id == product_id).order_by(Review.created_at.desc()).all()
    return [serialize(r) for r in reviews]

@router.post("", response_model=ReviewOut)
def create_review(payload: ReviewCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    r = Review(user_id=user.id, **payload.dict())
    db.add(r); db.commit(); db.refresh(r)
    return serialize(r)

@router.put("/{review_id}", response_model=ReviewOut)
def update_review(review_id: int, payload: ReviewUpdate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    r = db.query(Review).filter(Review.id == review_id, Review.user_id == user.id).first()
    if not r: raise HTTPException(404, "Not found")
    for k, v in payload.dict(exclude_unset=True).items():
        setattr(r, k, v)
    db.commit(); db.refresh(r)
    return serialize(r)

@router.delete("/{review_id}")
def delete_review(review_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    r = db.query(Review).filter(Review.id == review_id, Review.user_id == user.id).first()
    if not r: raise HTTPException(404, "Not found")
    db.delete(r); db.commit()
    return {"message": "Deleted"}
