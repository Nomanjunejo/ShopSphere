from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryOut
from app.dependencies.auth import require_admin
from typing import List

router = APIRouter(prefix="/api/categories", tags=["Categories"])

@router.get("", response_model=List[CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()

@router.post("", response_model=CategoryOut, dependencies=[Depends(require_admin)])
def create_category(payload: CategoryCreate, db: Session = Depends(get_db)):
    c = Category(**payload.dict())
    db.add(c); db.commit(); db.refresh(c)
    return c

@router.put("/{cid}", response_model=CategoryOut, dependencies=[Depends(require_admin)])
def update_category(cid: int, payload: CategoryCreate, db: Session = Depends(get_db)):
    c = db.query(Category).filter(Category.id == cid).first()
    if not c: raise HTTPException(404, "Not found")
    c.name = payload.name
    db.commit(); db.refresh(c)
    return c

@router.delete("/{cid}", dependencies=[Depends(require_admin)])
def delete_category(cid: int, db: Session = Depends(get_db)):
    c = db.query(Category).filter(Category.id == cid).first()
    if not c: raise HTTPException(404, "Not found")
    db.delete(c); db.commit()
    return {"message": "Deleted"}
