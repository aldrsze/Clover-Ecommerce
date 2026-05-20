const db = require('../config/db');

const Product = {
    getAllProducts: async () => {
        try {
            const query = `
                SELECT 
                    product_id AS id, 
                    name, 
                    description, 
                    price, 
                    stock_quantity, 
                    image_path AS image, 
                    category, 
                    preferences 
                FROM products
            `;
            const { rows } = await db.query(query)
            return rows;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },

    getByPreferences: async (preferences) => {
        try {
            const query = `
                SELECT 
                    product_id AS id, 
                    name, 
                    description, 
                    price, 
                    stock_quantity, 
                    image_path AS image, 
                    category, 
                    preferences 
                FROM products 
                WHERE preferences && $1
            `;
            const { rows } = await db.query(query, [preferences]);
            return rows;
        } catch (error) {
            console.error('Error fetching products by preferences:', error);
            throw error;
        }
    },

    create: async (name, description, price, stock_quantity, imagePath, category, preferences) => {
        try {
            const query = `
                INSERT INTO products (name, description, price, stock_quantity, image_path, category, preferences)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING 
                    product_id AS id, 
                    name, 
                    description, 
                    price, 
                    stock_quantity, 
                    image_path AS image, 
                    category, 
                    preferences;
            `;
            const {rows} = await db.query(query, [
                name,
                description,
                price,
                stock_quantity,
                imagePath,
                category,
                preferences
            ]);
            return rows[0];
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    }
};

module.exports = Product;