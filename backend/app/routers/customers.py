from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import schemas, crud
from ..deps import get_db

router = APIRouter(prefix='/customers', tags=['customers'])

@router.post('', response_model=schemas.Customer, status_code=status.HTTP_201_CREATED)
def create_customer(customer: schemas.CustomerCreate, db: Session = Depends(get_db)):
    return crud.create_customer(db, customer)

@router.get('', response_model=List[schemas.Customer])
def get_customers(db: Session = Depends(get_db)):
    return crud.get_customers(db)

@router.get('/{customer_id}', response_model=schemas.Customer)
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = crud.get_customer(db, customer_id)
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Customer not found')
    return customer

@router.delete('/{customer_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    crud.delete_customer(db, customer_id)
    return None
