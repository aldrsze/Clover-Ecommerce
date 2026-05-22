# Clover | Full-Stack E-Commerce

A modern, high-end e-commerce platform built with the **PERN stack**. This project features a responsive artisan catalog and a robust administrative dashboard for inventory management.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, CSS3 (Grid & Flexbox), Lucide React
- **Backend:** Node.js, Express, Multer
- **Database:** PostgreSQL
- **Tools:** Git, NPM

## ✨ Key Features

- **Fluid Product Catalog:** Responsive grid layout with 5-6 cards per row on desktop.
- **Dynamic Filtering:** Category and preference-based filtering powered by PostgreSQL.
- **Admin Dashboard:** Full product management interface with image upload capabilities.
- **Scroll-Spy Navigation:** Seamless category browsing using Intersection Observer.
- **Premium Aesthetics:** Custom animations and high-density visual design.

## 🚀 Local Setup

### Prerequisites
- Node.js (LTS)
- PostgreSQL

### 1. Clone the repository
   `git clone https://github.com/aldrsze/Clover-Ecommerce.git`

### 2. Backend Configuration
- Navigate to `/backend`
- Run `npm install`
- Create a `.env` file in the `/backend` directory:
  ```env
  PORT=5000
  DB_USER=your_postgres_user
  DB_HOST=localhost
  DB_DATABASE=your_database_name
  DB_PASSWORD=your_postgres_password
  DB_PORT=5432
  ```
- Start server: `npm run dev`

### 3. Frontend Configuration
- Navigate to `/frontend`
- Run `npm install`
- Start client: `npm run dev`

---

**Developed by aldrsze**  
*Showcasing full-stack fundamentals and modern web design.*
