from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import schemas, crud
from ..deps import get_db

router = APIRouter(prefix='/orders', tags=['orders'])

@router.post('', response_model=schemas.Order, status_code=status.HTTP_201_CREATED)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    return crud.create_order(db, order)

@router.get('', response_model=List[schemas.Order])
def get_orders(db: Session = Depends(get_db)):
    return crud.get_orders(db)

@router.get('/{order_id}', response_model=schemas.Order)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = crud.get_order(db, order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Order not found')
    return order

@router.delete('/{order_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_order(order_id: int, db: Session = Depends(get_db)):
    crud.delete_order(db, order_id)
    return None
