from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import schemas, crud
from ..deps import get_db

router = APIRouter(prefix='/products', tags=['products'])

@router.post('', response_model=schemas.Product, status_code=status.HTTP_201_CREATED)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    return crud.create_product(db, product)

@router.get('', response_model=List[schemas.Product])
def get_products(db: Session = Depends(get_db)):
    return crud.get_products(db)

@router.get('/{product_id}', response_model=schemas.Product)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = crud.get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Product not found')
    return product

@router.put('/{product_id}', response_model=schemas.Product)
def update_product(product_id: int, product_update: schemas.ProductUpdate, db: Session = Depends(get_db)):
    return crud.update_product(db, product_id, product_update)

@router.delete('/{product_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    crud.delete_product(db, product_id)
    return None
