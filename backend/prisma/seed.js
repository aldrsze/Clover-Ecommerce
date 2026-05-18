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
        id: "bev-javachip-javakula",
        name: "Javachip Javakula",
        price: 460.0,
        image: "images/JAVACHIP-JAVAKULA-removebg.png",
        category: "cold-beverages",
        preferences: ["sweet"]
      },
      {
        id: "bev-strawberry-milkshake",
        name: "Strawberry Milkshake",
        price: 365.0,
        image: "images/Strawberry-Milkshake-600x600-removebg.png",
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
        id: "breakfast-ham-cheese-omelette",
        name: "Ham & Cheese Omelette",
        price: 260.0,
        image: "images/Ham-Cheese-Omelette-600x600.jpg",
        category: "breakfast",
        preferences: ["savory", "meat"]
      },
      {
        id: "breakfast-pancakes",
        name: "Classic Pancakes",
        price: 245.0,
        image: "images/PANCAKES-600x600.jpg",
        category: "breakfast",
        preferences: ["sweet"]
      },
      { 
        id: "sandwich-smoked-salmon", 
        name: "Smoked Salmon Sandwich", 
        price: 375.0, 
        image: "images/SALMON.jpg", 
        category: "sandwiches", 
        preferences: ["savory", "seafood"] 
      },
      {
        id: "sandwich-margherita-flatbread",
        name: "Margherita Flatbread",
        price: 320.0,
        image: "images/Margherita-Flatbread-600x600.jpg",
        category: "sandwiches",
        preferences: ["savory"]
      },
      {
        id: "sandwich-quattro-flatbread",
        name: "Quattro Flatbread",
        price: 350.0,
        image: "images/QUATTRO.jpg",
        category: "sandwiches",
        preferences: ["savory", "meat"]
      },
      {
        id: "pastry-blueberry-cheesecake",
        name: "Blueberry Cheesecake",
        price: 230.0,
        image: "images/Blueberry-Cheesecake-600x600.jpg",
        category: "pastries",
        preferences: ["sweet"]
      },
      {
        id: "pastry-nutella-croissant",
        name: "Nutella Croissant",
        price: 190.0,
        image: "images/Nutella-Croissant-600x600.jpg",
        category: "pastries",
        preferences: ["sweet"]
      },
      {
        id: "pastry-classic-cinnamon-roll",
        name: "Classic Cinnamon Roll",
        price: 175.0,
        image: "images/CLASSIC-CINNAMON-ROLL.jpg",
        category: "pastries",
        preferences: ["sweet"]
      },
      {
        id: "pastry-torched-classic-cheesecake",
        name: "Torched Classic Cheesecake",
        price: 255.0,
        image: "images/Torched-Classic-Cheesecake-3-600x600.jpg",
        category: "pastries",
        preferences: ["sweet"]
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