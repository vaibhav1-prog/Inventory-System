# Inventory & Order Management System

Production-ready inventory and order management system with a React frontend, FastAPI backend, PostgreSQL database, and Docker Compose orchestration.

## Project structure

- `backend/`
  - `app/` - FastAPI application code
  - `Dockerfile` - backend container build
  - `requirements.txt` - Python dependencies
  - `.env.example` - backend environment variables
- `frontend/`
  - `public/` - React public assets
  - `src/` - React app source code
  - `Dockerfile` - frontend container build
  - `package.json` - npm dependencies and scripts
  - `.env.example` - frontend environment variables
- `docker-compose.yml` - frontend, backend, and database services
- `.dockerignore` - ignored files for Docker builds
- `.gitignore` - ignored files for Git

## Local development

1. Copy Docker Compose environment variables:
   - `copy .env.example .env`

2. Optional: copy frontend environment variables for local non-Docker development:
   - `cd frontend`
   - `copy .env.example .env`

3. Start the application stack:
   - `cd c:\Users\asus\Desktop\inventory-system`
   - `docker compose up --build`

4. Access the app:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8000`
   - FastAPI docs: `http://localhost:8000/docs`

## Deployment notes

- Backend: deploy to Render, Railway, or Fly.io
- Frontend: deploy to Vercel or Netlify
- Use `REACT_APP_API_URL` in frontend deployment to point to live backend URL
- Use a managed PostgreSQL service and configure `DATABASE_URL` in backend deployment
