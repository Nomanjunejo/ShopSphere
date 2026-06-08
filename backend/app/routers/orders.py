from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.order import Order, OrderItem
from app.models.cart import CartItem
from app.models.product import Product
from app.schemas.order import OrderOut, OrderStatusUpdate
from app.dependencies.auth import get_current_user, require_admin
from app.models.user import User

router = APIRouter(prefix="/api/orders", tags=["Orders"])

VALID_STATUSES = {"Pending", "Processing", "Shipped", "Delivered"}

@router.post("", response_model=OrderOut)
def place_order(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    cart_items = db.query(CartItem).filter(CartItem.user_id == user.id).all()
    if not cart_items:
        raise HTTPException(400, "Cart is empty")

    total = 0.0
    order = Order(user_id=user.id, total_amount=0, status="Pending")
    db.add(order); db.flush()

    for ci in cart_items:
        product = db.query(Product).filter(Product.id == ci.product_id).first()
        if not product or product.stock < ci.quantity:
            raise HTTPException(400, f"Insufficient stock for {product.name if product else 'product'}")
        line_total = product.price * ci.quantity
        total += line_total
        db.add(OrderItem(order_id=order.id, product_id=product.id, quantity=ci.quantity, price=product.price))
        product.stock -= ci.quantity

    order.total_amount = total
    # Clear cart
    for ci in cart_items:
        db.delete(ci)
    db.commit(); db.refresh(order)
    return order

@router.get("", response_model=List[OrderOut])
def my_orders(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Order).filter(Order.user_id == user.id).order_by(Order.created_at.desc()).all()

@router.get("/admin/all", response_model=List[OrderOut], dependencies=[Depends(require_admin)])
def all_orders(db: Session = Depends(get_db)):
    return db.query(Order).order_by(Order.created_at.desc()).all()

@router.get("/{order_id}", response_model=OrderOut)
def order_detail(order_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    o = db.query(Order).filter(Order.id == order_id).first()
    if not o: raise HTTPException(404, "Not found")
    if o.user_id != user.id and user.role != "admin":
        raise HTTPException(403, "Forbidden")
    return o

@router.put("/{order_id}/status", response_model=OrderOut, dependencies=[Depends(require_admin)])
def update_status(order_id: int, payload: OrderStatusUpdate, db: Session = Depends(get_db)):
    if payload.status not in VALID_STATUSES:
        raise HTTPException(400, "Invalid status")
    o = db.query(Order).filter(Order.id == order_id).first()
    if not o: raise HTTPException(404, "Not found")
    o.status = payload.status
    db.commit(); db.refresh(o)
    return o
