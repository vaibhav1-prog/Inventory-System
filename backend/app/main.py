from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base
from .routers.products import router as products_router
from .routers.customers import router as customers_router
from .routers.orders import router as orders_router

app = FastAPI(title='Inventory & Order Management API')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(products_router)
app.include_router(customers_router)
app.include_router(orders_router)

@app.on_event('startup')
def on_startup():
    Base.metadata.create_all(bind=engine)

@app.get('/')
def root():
    return {'status': 'ok', 'message': 'Inventory API is running'}
