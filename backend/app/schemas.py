from typing import List, Optional
from pydantic import BaseModel, ConfigDict, EmailStr, conint, confloat

class ProductBase(BaseModel):
    name: str
    sku: str
    price: confloat(gt=0)
    quantity: conint(ge=0)

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    sku: Optional[str] = None
    price: Optional[confloat(gt=0)] = None
    quantity: Optional[conint(ge=0)] = None

class Product(ProductBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

class CustomerBase(BaseModel):
    full_name: str
    email: EmailStr
    phone: str

class CustomerCreate(CustomerBase):
    pass

class Customer(CustomerBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

class OrderItemBase(BaseModel):
    product_id: int
    quantity: conint(gt=0)

class OrderCreate(BaseModel):
    customer_id: int
    items: List[OrderItemBase]

class OrderItem(OrderItemBase):
    unit_price: float

    model_config = ConfigDict(from_attributes=True)

class Order(BaseModel):
    id: int
    customer_id: int
    total_amount: float
    items: List[OrderItem]

    model_config = ConfigDict(from_attributes=True)
