const { Pool } = require('pg');                         // 1. Import pg driver
const { PrismaPg } = require('@prisma/adapter-pg');     // 2. Import Prisma 7 Adapter
const { PrismaClient } = require('@prisma/client');     // 3. Import Prisma Client
require('dotenv').config();                             // 4. Load your .env file

// 5. Connect the driver pool to your local DATABASE_URL
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear out existing records first to avoid duplicate errors if you run this script multiple times
  await prisma.transactionItem.deleteMany({});
  await prisma.transaction.deleteMany({});
  await prisma.product.deleteMany({});

  // Insert your Clover product roster
  await prisma.product.createMany({
    data: [
      { 
        id: "bev-iced-white-chocolate-mocha", 
        name: "Iced White Chocolate Mocha", 
        price: 450.0, 
        image: "images/ICED-WHITE-CHOCOLATE-MOCHA-removebg.png", 
        category: "cold-beverages", 
        preferences: ["sweet"] 
      },
      { 
        id: "breakfast-big-breakfast", 
        name: "The Big Breakfast", 
        price: 295.0, 
        image: "images/BIG-BREAKFAST-3.jpg", 
        category: "breakfast", 
        preferences: ["savory", "meat"] 
      },
      { 
        id: "sandwich-smoked-salmon", 
        name: "Smoked Salmon Sandwich", 
        price: 375.0, 
        image: "images/SALMON.jpg", 
        category: "sandwiches", 
        preferences: ["savory", "seafood"] 
      }
    ]
  });
  
  console.log("Database seeded successfully!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Clean up connections when finished
    await prisma.$disconnect();
    await pool.end();
  });