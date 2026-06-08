from pydantic import BaseModel
from app.schemas.product import ProductOut

class WishlistCreate(BaseModel):
    product_id: int

class WishlistOut(BaseModel):
    id: int
    product_id: int
    product: ProductOut
    class Config:
        from_attributes = True
