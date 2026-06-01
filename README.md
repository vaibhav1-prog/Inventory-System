# Inventra - Inventory & Order Management System

Inventra is a full-stack inventory and order management application built for managing products, customers, orders, and stock levels. The system includes a React frontend, a FastAPI backend, PostgreSQL persistence, and a complete Docker Compose setup for local development and containerized execution.

## Features

- Product management with SKU, price, and stock quantity
- Customer management with unique email validation
- Order creation with multiple product items
- Automatic order total calculation
- Automatic stock reduction when orders are created
- Direct stock increase/decrease controls from the product screen
- Low-stock visibility on the dashboard
- Responsive professional dashboard UI
- API validation and error handling
- PostgreSQL database persistence
- Dockerized frontend, backend, and database services

## Tech Stack

**Frontend**
- React
- Tailwind CSS
- Axios
- Recharts
- Lucide React

**Backend**
- Python
- FastAPI
- SQLAlchemy
- Pydantic
- Uvicorn

**Database**
- PostgreSQL

**DevOps**
- Docker
- Docker Compose

## Project Structure

```text
inventory-system/
  backend/
    app/
      routers/
      config.py
      crud.py
      database.py
      deps.py
      main.py
      models.py
      schemas.py
    Dockerfile
    requirements.txt
    .env.example

  frontend/
    public/
    src/
      api/
      components/
    Dockerfile
    package.json
    .env.example

  docker-compose.yml
  .dockerignore
  .gitignore
  .env.example
  README.md
```

## Environment Variables

Create a root `.env` file from the example file before running Docker Compose:

```powershell
copy .env.example .env
```

Root environment variables:

```env
POSTGRES_USER=*****       
POSTGRES_PASSWORD=*****
POSTGRES_DB=*****
```

Frontend environment variable:

```env
REACT_APP_API_URL=http://localhost:8000
```

Backend environment variable:

```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/inventory_db
```

Do not commit real `.env` files. Use `.env.example` files for documentation.

## Running With Docker Compose

From the project root:

```powershell
docker compose up --build
```

Services:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- API docs: `http://localhost:8000/docs`
- PostgreSQL host port: `5433`

PostgreSQL connection for local database tools:

```text
Host: localhost
Port: 5433
Database: inventory_db
User: postgres
Password: postgres
```

## API Endpoints

### Products

```text
POST   /products
GET    /products
GET    /products/{product_id}
PUT    /products/{product_id}
DELETE /products/{product_id}
```

### Customers

```text
POST   /customers
GET    /customers
GET    /customers/{customer_id}
DELETE /customers/{customer_id}
```

### Orders

```text
POST   /orders
GET    /orders
GET    /orders/{order_id}
DELETE /orders/{order_id}
```

## Business Rules

- Product SKU must be unique.
- Customer email must be unique.
- Product quantity cannot be negative.
- Orders cannot be placed when stock is insufficient.
- Creating an order automatically reduces stock.
- Deleting an order restores stock.
- Order totals are calculated by the backend.
- Request data is validated before processing.

## Docker Notes

The project includes:

- Backend Dockerfile
- Frontend Dockerfile
- Root `.dockerignore`
- Docker Compose configuration
- PostgreSQL named volume for persistence

Docker Compose services:

```text
frontend
backend
db
```

PostgreSQL data is persisted in the named Docker volume:

```text
pgdata
```

## Deployment Notes

Recommended deployment setup:

- Backend: Docker-based web service
- Frontend: static React deployment
- Database: managed PostgreSQL

Required production environment variables:

Backend:

```env
DATABASE_URL=<managed-postgresql-url>
```

Frontend:

```env
REACT_APP_API_URL=<live-backend-api-url>
```

## Submission Checklist

- GitHub repository containing frontend and backend code
- Backend Docker Hub image
- Live frontend deployment URL
- Live backend API URL

