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
                WHERE preferences @> $1
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
    },

    update: async (id, fields) => {
        try {
            // Build SET clause dynamically from provided fields
            const allowedColumns = {
                name: 'name',
                description: 'description',
                price: 'price',
                stock_quantity: 'stock_quantity',
                image_path: 'image_path',
                category: 'category',
                preferences: 'preferences'
            };

            const setClauses = [];
            const values = [];
            let paramIndex = 1;

            for (const [key, column] of Object.entries(allowedColumns)) {
                if (fields[key] !== undefined) {
                    setClauses.push(`${column} = $${paramIndex}`);
                    values.push(fields[key]);
                    paramIndex++;
                }
            }

            if (setClauses.length === 0) {
                throw new Error('No valid fields provided for update');
            }

            values.push(id);

            const query = `
                UPDATE products
                SET ${setClauses.join(', ')}
                WHERE product_id = $${paramIndex}
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

            const { rows } = await db.query(query, values);
            return rows[0];
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const query = `
                DELETE FROM products
                WHERE product_id = $1
                RETURNING product_id AS id;
            `;
            const { rows } = await db.query(query, [id]);
            return rows[0];
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    }
};

module.exports = Product;