from pydantic import BaseModel
from typing import List
from datetime import datetime
from app.schemas.product import ProductOut

class OrderItemOut(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: float
    product: ProductOut
    class Config:
        from_attributes = True

class OrderOut(BaseModel):
    id: int
    user_id: int
    total_amount: float
    status: str
    created_at: datetime
    items: List[OrderItemOut]
    class Config:
        from_attributes = True

class OrderStatusUpdate(BaseModel):
    status: str
