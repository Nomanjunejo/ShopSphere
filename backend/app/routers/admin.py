from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from app.database import get_db
from app.dependencies.auth import require_admin
from app.models.user import User
from app.models.product import Product
from app.models.order import Order, OrderItem

router = APIRouter(prefix="/api/admin", tags=["Admin"])

@router.get("/analytics", dependencies=[Depends(require_admin)])
def analytics(db: Session = Depends(get_db)):
    total_users = db.query(func.count(User.id)).scalar() or 0
    total_products = db.query(func.count(Product.id)).scalar() or 0
    total_orders = db.query(func.count(Order.id)).scalar() or 0
    total_revenue = db.query(func.coalesce(func.sum(Order.total_amount), 0)).scalar() or 0

    # Monthly revenue last 6 months
    six_months_ago = datetime.utcnow() - timedelta(days=180)
    monthly = (
        db.query(
            func.to_char(Order.created_at, 'YYYY-MM').label('month'),
            func.sum(Order.total_amount).label('revenue')
        )
        .filter(Order.created_at >= six_months_ago)
        .group_by('month').order_by('month').all()
    )
    monthly_revenue = [{"month": m, "revenue": float(r)} for m, r in monthly]

    # Top selling products
    top = (
        db.query(Product.name, func.sum(OrderItem.quantity).label('sold'))
        .join(OrderItem, OrderItem.product_id == Product.id)
        .group_by(Product.id).order_by(func.sum(OrderItem.quantity).desc()).limit(5).all()
    )
    top_products = [{"name": n, "sold": int(s)} for n, s in top]

    recent_orders = db.query(Order).order_by(Order.created_at.desc()).limit(5).all()
    recent = [{"id": o.id, "total": o.total_amount, "status": o.status, "created_at": o.created_at} for o in recent_orders]

    return {
        "total_users": total_users,
        "total_products": total_products,
        "total_orders": total_orders,
        "total_revenue": float(total_revenue),
        "monthly_revenue": monthly_revenue,
        "top_products": top_products,
        "recent_orders": recent,
    }
