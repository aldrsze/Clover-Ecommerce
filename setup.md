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
Open `http://localhost:5173` in your browser after both servers are running.

## Pre-created admin account

For convenience a local admin account is already present in the database:

- **Username:** admin
- **Password:** admin1234

Use these credentials to sign in via the admin/login UI. If the account is missing you can either register via the app.

## Demo assets

The repository includes a `screenshots/` folder with UI screenshots and a `Clover.mp4` recording demonstrating the app. Open `screenshots/` to review visuals or play the video for a quick walkthrough.
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
