# Clover Local Setup

This guide explains how to run Clover locally.

## Requirements

- Node.js LTS
- npm
- PostgreSQL running locally

## 1. Clone the repo

```bash
git clone https://github.com/aldrsze/Clover-Ecommerce.git
cd Clover-Ecommerce
```

## 2. Create the database

Create a PostgreSQL database named `clover_db`, then import the schema/data from `clover_db.sql`.

Example with `psql`:

```bash
psql -U postgres -d clover_db -f clover_db.sql
```

If you use pgAdmin or another GUI, restore the same SQL file into the `clover_db` database.

## 3. Set up the backend

```bash
cd backend
npm install
```

Copy `backend/.env.example` to `backend/.env` and update the values for your local machine:

```env
NODE_ENV=development
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=clover_db
DB_PASSWORD=yourpassword
DB_PORT=5432
JWT_SECRET=your_local_secret
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

## 4. Set up the frontend

Open a new terminal:

```bash
cd frontend
npm install
```

Copy `frontend/.env.example` to `frontend/.env` and keep these values for local development:

```env
VITE_SERVER_URL=http://localhost:5000
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

## 5. Open the app

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## Useful Commands

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

Build frontend:

```bash
cd frontend
npm run build
```

## Notes

- Keep your `.env` files out of version control.
- If you change the backend port, update `VITE_API_BASE_URL` and `CORS_ALLOWED_ORIGINS`.
