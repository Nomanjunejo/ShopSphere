"""
Run: python -m app.utils.seed
"""
from app.database import SessionLocal, Base, engine
from app.models.user import User
from app.models.category import Category
from app.models.product import Product
from app.models.order import Order, OrderItem
from app.core.security import hash_password
from sqlalchemy import text

# Ensure tables exist
Base.metadata.create_all(bind=engine)
db = SessionLocal()

def run():
    print("Cleaning out old database tables...")
    try:
        # Safely truncate all tables and reset tracking sequences in PostgreSQL
        db.execute(text("TRUNCATE TABLE order_items, orders, products, categories, users RESTART IDENTITY CASCADE;"))
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Note: Safe truncation skipped or failed ({e}), clearing manually...")
        # Fallback manual deletion if tables are empty or setup differs
        db.query(OrderItem).delete()
        db.query(Order).delete()
        db.query(Product).delete()
        db.query(Category).delete()
        db.query(User).delete()
        db.commit()

    print("Seeding fresh data...")

    # Admin + customers
    admin = User(name="Admin", email="admin@shopsphere.com", password_hash=hash_password("admin123"), role="admin")
    c1 = User(name="John Doe", email="john@example.com", password_hash=hash_password("password"), role="customer")
    c2 = User(name="Jane Smith", email="jane@example.com", password_hash=hash_password("password"), role="customer")
    db.add_all([admin, c1, c2])
    db.commit()

    # Categories
    cats_data = ["Electronics", "Clothing", "Books", "Home & Kitchen", "Sports"]
    cats = [Category(name=n) for n in cats_data]
    db.add_all(cats)
    db.commit()

    products = [
        # === ELECTRONICS ===
        Product(
            name="Wireless Headphones", 
            description="Noise-cancelling Bluetooth headphones", 
            price=89.99, stock=25, 
            image_url="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80", 
            category_id=cats[0].id
        ),
        Product(
            name="Smart Watch", 
            description="Fitness tracking smartwatch", 
            price=149.99, stock=15, 
            image_url="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80", 
            category_id=cats[0].id
        ),
        Product(
            name="Laptop Stand", 
            description="Ergonomic aluminum laptop stand", 
            price=39.99, stock=40, 
            image_url="https://images.unsplash.com/photo-1575399545768-5f1840c1312d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8TEFQVE9QJTIwU1RBTkR8ZW58MHx8MHx8fDA%3D", 
            category_id=cats[0].id
        ),
        Product(
            name="USB-C Hub", 
            description="7-in-1 USB-C hub adapter", 
            price=29.99, stock=8, 
            image_url="https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=500&auto=format&fit=crop&q=80", 
            category_id=cats[0].id
        ),
        Product(
            name="Mechanical Keyboard", 
            description="RGB mechanical gaming keyboard", 
            price=119.99, stock=20, 
            image_url="https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&auto=format&fit=crop&q=80", 
            category_id=cats[0].id
        ),
        
        # === CLOTHING ===
        Product(
            name="Cotton T-Shirt", 
            description="Premium organic cotton tee", 
            price=19.99, stock=100, 
            image_url="https://images.unsplash.com/photo-1661181475147-bbd20ef65781?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNvdHRvbiUyMHQlMjBzaGlydHxlbnwwfHwwfHx8MA%3D%3D", 
            category_id=cats[1].id
        ),
        Product(
            name="Denim Jacket", 
            description="Classic blue denim jacket", 
            price=59.99, stock=30, 
            image_url="https://images.unsplash.com/photo-1537465978529-d23b17165b3b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZGVuaW0lMjBqYWNrZXR8ZW58MHx8MHx8fDA%3D", 
            category_id=cats[1].id
        ),
        Product(
            name="Running Shoes", 
            description="Lightweight running shoes", 
            price=79.99, stock=45, 
            image_url="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80", 
            category_id=cats[1].id
        ),
        Product(
            name="Hooded Sweatshirt", 
            description="Comfortable fleece hoodie", 
            price=44.99, stock=5, 
            image_url="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&auto=format&fit=crop&q=80", 
            category_id=cats[1].id
        ),
        
        # === BOOKS ===
        Product(
            name="The Pragmatic Programmer", 
            description="Classic software book", 
            price=24.99, stock=50, 
            image_url="https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=500&auto=format&fit=crop&q=80", 
            category_id=cats[2].id
        ),
        Product(
            name="Clean Code", 
            description="Robert C. Martin book", 
            price=29.99, stock=35, 
            image_url="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&auto=format&fit=crop&q=80", 
            category_id=cats[2].id
        ),
        Product(
            name="Atomic Habits", 
            description="James Clear bestseller", 
            price=14.99, stock=60, 
            image_url="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80", 
            category_id=cats[2].id
        ),
        
        # === HOME & KITCHEN ===
        Product(
            name="Coffee Maker", 
            description="Programmable drip coffee maker", 
            price=69.99, stock=18, 
            image_url="https://images.unsplash.com/photo-1707241358597-bafcc8a8e73d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29mZmVlJTIwbWFrZXJ8ZW58MHx8MHx8fDA%3D", 
            category_id=cats[3].id
        ),
        Product(
            name="Knife Set", 
            description="Stainless steel kitchen knife set", 
            price=89.99, stock=12, 
            image_url="https://images.unsplash.com/photo-1593618229012-8aaad1cfefc3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a25pZmUlMjBzZXR8ZW58MHx8MHx8fDA%3D", 
            category_id=cats[3].id
        ),
        Product(
            name="Air Fryer", 
            description="5L digital air fryer", 
            price=99.99, stock=22, 
            image_url="https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?w=500&auto=format&fit=crop&q=80", 
            category_id=cats[3].id
        ),
        Product(
            name="Dinnerware Set", 
            description="16-piece ceramic dinnerware", 
            price=79.99, stock=9, 
            image_url="https://images.unsplash.com/photo-1631008788127-57317667a0d2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGlubmVyd2FyZSUyMHNldHxlbnwwfHwwfHx8MA%3D%3D", 
            category_id=cats[3].id
        ),
        
        # === SPORTS ===
        Product(
            name="Yoga Mat", 
            description="Eco-friendly non-slip yoga mat", 
            price=29.99, stock=55, 
            image_url="https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500&auto=format&fit=crop&q=80", 
            category_id=cats[4].id
        ),
        Product(
            name="Dumbbell Set", 
            description="Adjustable dumbbell pair", 
            price=149.99, stock=10, 
            image_url="https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=500&auto=format&fit=crop&q=80", 
            category_id=cats[4].id
        ),
        Product(
            name="Soccer Ball", 
            description="Official size 5 soccer ball", 
            price=24.99, stock=40, 
            image_url="https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c29jY2VyYmFsbHxlbnwwfHwwfHx8MA%3D%3D", 
            category_id=cats[4].id
        ),
        Product(
            name="Resistance Bands", 
            description="Set of 5 resistance bands", 
            price=19.99, stock=70, 
            image_url="https://images.unsplash.com/photo-1515775538093-d2d95c5ee4f5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cmVzaXN0YW5jZSUyMGJhbmRzfGVufDB8fDB8fHww", 
            category_id=cats[4].id
        ),
    ]
    db.add_all(products)
    db.commit()

    # Sample order
    order = Order(user_id=c1.id, total_amount=109.98, status="Delivered")
    db.add(order)
    db.flush()
    db.add(OrderItem(order_id=order.id, product_id=products[0].id, quantity=1, price=89.99))
    db.add(OrderItem(order_id=order.id, product_id=products[5].id, quantity=1, price=19.99))
    db.commit()

    print("✅ Seed complete!")
    print("Admin: admin@shopsphere.com / admin123")
    print("Customer: john@example.com / password")

if __name__ == "__main__":
    run()