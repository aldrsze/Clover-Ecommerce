const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');                         // 1. Import pg driver
const { PrismaPg } = require('@prisma/adapter-pg');     // 2. Import Prisma 7 Adapter
const { PrismaClient } = require('@prisma/client');     // 3. Import Prisma Client
require('dotenv').config();                             // 4. Load your .env file

const app = express();

// 5. Connect the driver pool to your local DATABASE_URL from your .env
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// 6. Pass the required adapter options directly into the client constructor
const prisma = new PrismaClient({ adapter });

app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────────────────────────────────────────
// YOUR API ENDPOINTS (GET /api/products, POST /api/transactions, etc.) GO HERE
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend API running on port ${PORT}`));