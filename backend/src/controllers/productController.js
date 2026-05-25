const Product = require('../models/productModel');

/**
 * Get all products or filter by preferences.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.getProducts = async (req, res) => {
    try {
        const { preferences } = req.query;
        let products;

        if (preferences) {
            const preference = preferences.split(',');
            products = await Product.getByPreferences(preference);
        } else {
            products = await Product.getAllProducts();
        }

        res.json(products);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch products.' });
    }
};

/**
 * Create a new product.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.createProduct = async (req, res) => {
    let { name, description, price, stock_quantity, category, preferences, image } = req.body;
    
    // imagePath is now directly the base64 string from frontend
    const imagePath = image || null;

    try {
        const newProduct = await Product.create(name, description, price, stock_quantity, imagePath, category, preferences);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create product.' });
    }
};

/**
 * Update an existing product by ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    let { name, description, price, stock_quantity, category, preferences, image } = req.body;

    // Build the fields object for the dynamic update
    const fields = {};
    if (name !== undefined) fields.name = name;
    if (description !== undefined) fields.description = description;
    if (price !== undefined) fields.price = price;
    if (stock_quantity !== undefined) fields.stock_quantity = stock_quantity;
    if (category !== undefined) fields.category = category;
    if (preferences !== undefined) fields.preferences = preferences;

    // Handle image — if provided as base64 string
    if (image !== undefined) {
        fields.image_path = image;
    }

    try {
        const updatedProduct = await Product.update(id, fields);
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update product.' });
    }
};

/**
 * Delete a product by ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = await Product.delete(id);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully', id: deletedProduct.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete product.' });
    }
};
