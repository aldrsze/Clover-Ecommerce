# Clover | E-Commerce

A high-performance e-commerce platform built using the **PERN stack** (PostgreSQL, Express, React, Node.js). This project demonstrates the implementation of a modern, responsive storefront and a robust administrative backend, developed as a primary showcase for my fullstack skills.

---

## 🏗️ Architectural Overview

Clover is designed with a focus on **clean separation of concerns** and **semantic frontend architecture**. 

### Backend (Node.js / Express / PostgreSQL)
- **Relational Data Modeling:** Structured PostgreSQL database for product and inventory management.
- **RESTful API:** Developed custom endpoints for dynamic product retrieval and filtering.
- **Middleware Integration:** Implemented Multer for managed local file storage and image processing.

### Frontend (React 19 / Vite / CSS3)
- **State Management:** Utilized React Hooks (`useState`, `useEffect`, `useCallback`) for dynamic UI updates and efficient data fetching.
- **Custom UI Engine:** Built entirely with pure CSS3 to demonstrate mastery of Grid and Flexbox layouts, avoiding heavy UI frameworks to maintain a high performance-to-bundle-size ratio.
- **Client-Side Optimization:** Implemented Intersection Observers for category-based scroll synchronization and navigation.

## 🚀 Technical Highlights

### 1. Advanced Responsive Grid
- **Implementation:** Leveraged CSS Grid `auto-fill` and `minmax` functions to create a fluid, high-density product catalog (5-6 cards per row on standard desktop).
- **Outcome:** A cinematic, magazine-style layout that adapts seamlessly to ultra-wide displays (2000px+) without breaking visual hierarchy.

### 2. Real-Time Data Filtering
- **Logic:** Developed a dynamic query-building system that translates frontend preference toggles into optimized PostgreSQL queries.
- **Normalization:** Implemented a transformation layer to handle the mapping between relational database naming conventions and React component requirements.

### 3. Administrative Interface
- **Functionality:** A dedicated dashboard for catalog management, featuring dynamic form validation and real-time stock status monitoring.

## 🛠️ Development & Installation

### Prerequisites
- Node.js (LTS)
- PostgreSQL

### Local Setup
1. **Clone Repository:**
   ```bash
   git clone [repository-url]
   ```
2. **Server Configuration:**
   - Navigate to `/backend`.
   - Run `npm install`.
   - Configure `.env` with your PostgreSQL credentials.
   - Start: `npm run dev`.
3. **Client Configuration:**
   - Navigate to `/frontend`.
   - Run `npm install`.
   - Start: `npm run dev`.

## 📈 Roadmap
- [ ] Implementation of secure Stripe/PayPal payment gateway.
- [ ] JWT-based user authentication and session management.
- [ ] Advanced full-text search indexing for product discovery.

---

**Developed by a aldrsze.**  
*Focused on mastering the fundamentals of full-stack engineering and modern web architecture.*
