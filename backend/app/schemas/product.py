from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.schemas.category import CategoryOut

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    stock: int = 0
    image_url: Optional[str] = None
    category_id: Optional[int] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    image_url: Optional[str] = None
    category_id: Optional[int] = None

class ProductOut(ProductBase):
    id: int
    created_at: datetime
    category: Optional[CategoryOut] = None
    class Config:
        from_attributes = True

class ProductListResponse(BaseModel):
    items: List[ProductOut]
    total: int
    page: int
    pages: int
