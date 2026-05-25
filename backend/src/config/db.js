require('dotenv').config();

const { Pool } = require('pg');

let pool;

// Support Render and other platforms that provide a single DATABASE_URL
if (process.env.DATABASE_URL) {
    // If the provider requires SSL (Render does), enable it. Adjust as needed.
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
} else {
    pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });
}

module.exports = {
    query: (text, params) => pool.query(text, params),
    connect: () => pool.connect()
};