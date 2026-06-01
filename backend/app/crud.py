from typing import Dict

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from . import models, schemas


def get_products(db: Session):
    return db.query(models.Product).all()


def get_product(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()


def get_product_by_sku(db: Session, sku: str):
    return db.query(models.Product).filter(models.Product.sku == sku).first()


def create_product(db: Session, product: schemas.ProductCreate):
    existing = get_product_by_sku(db, product.sku)
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail='Product SKU already exists')

    db_product = models.Product(
        name=product.name,
        sku=product.sku,
        price=product.price,
        quantity=product.quantity,
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


def update_product(db: Session, product_id: int, update_data: schemas.ProductUpdate):
    product = get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Product not found')

    if update_data.sku and update_data.sku != product.sku:
        existing = get_product_by_sku(db, update_data.sku)
        if existing:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail='Product SKU already exists')

    for field, value in update_data.dict(exclude_unset=True).items():
        setattr(product, field, value)

    if product.quantity < 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Product quantity cannot be negative')

    db.add(product)
    db.commit()
    db.refresh(product)
    return product


def delete_product(db: Session, product_id: int):
    product = get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Product not found')

    db.delete(product)
    db.commit()
    return None


def get_customers(db: Session):
    return db.query(models.Customer).all()


def get_customer(db: Session, customer_id: int):
    return db.query(models.Customer).filter(models.Customer.id == customer_id).first()


def get_customer_by_email(db: Session, email: str):
    return db.query(models.Customer).filter(models.Customer.email == email).first()


def create_customer(db: Session, customer: schemas.CustomerCreate):
    existing = get_customer_by_email(db, customer.email)
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail='Customer email already exists')

    db_customer = models.Customer(
        full_name=customer.full_name,
        email=customer.email,
        phone=customer.phone,
    )
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer


def delete_customer(db: Session, customer_id: int):
    customer = get_customer(db, customer_id)
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Customer not found')

    existing_orders = db.query(models.Order).filter(models.Order.customer_id == customer_id).count()
    if existing_orders:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='Cannot delete customer with existing orders',
        )

    db.delete(customer)
    db.commit()
    return None


def get_orders(db: Session):
    return db.query(models.Order).all()


def get_order(db: Session, order_id: int):
    return db.query(models.Order).filter(models.Order.id == order_id).first()


def create_order(db: Session, order_data: schemas.OrderCreate):
    customer = get_customer(db, order_data.customer_id)
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Customer not found')

    product_quantities: Dict[int, int] = {}
    for item in order_data.items:
        product_quantities[item.product_id] = product_quantities.get(item.product_id, 0) + item.quantity

    if not product_quantities:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Order must include at least one product')

    order_items = []
    total_amount = 0.0

    for product_id, quantity in product_quantities.items():
        product = get_product(db, product_id)
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Product {product_id} not found')
        if quantity > product.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f'Insufficient stock for product {product.sku}',
            )

        product.quantity -= quantity
        db.add(product)
        order_items.append(models.OrderItem(product_id=product.id, quantity=quantity, unit_price=product.price))
        total_amount += product.price * quantity

    order = models.Order(customer_id=customer.id, total_amount=total_amount)
    db.add(order)
    db.commit()
    db.refresh(order)

    for item in order_items:
        item.order_id = order.id
        db.add(item)

    db.commit()
    db.refresh(order)
    return order


def delete_order(db: Session, order_id: int):
    order = get_order(db, order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Order not found')

    for item in order.items:
        product = get_product(db, item.product_id)
        if product:
            product.quantity += item.quantity
            db.add(product)

    db.delete(order)
    db.commit()
    return None
