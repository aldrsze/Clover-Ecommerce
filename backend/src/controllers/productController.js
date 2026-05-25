const Product = require('../models/productModel');

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
        res.status(500).json({ error: error.message });
    }
};

exports.createProduct = async (req, res) => {
    let { name, description, price, stock_quantity, category, preferences } = req.body;
    
    // imagePath should be the relative path to the uploaded file
    const imagePath = req.file ? `uploads/${req.file.filename}` : (req.body.image || null);

    // If preferences is a string (from FormData), parse it
    if (typeof preferences === 'string') {
        try {
            preferences = JSON.parse(preferences);
        } catch (e) {
            preferences = preferences.split(',').map(p => p.trim());
        }
    }

    try {
        const newProduct = await Product.create(name, description, price, stock_quantity, imagePath, category, preferences);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    let { name, description, price, stock_quantity, category, preferences } = req.body;

    // Build the fields object for the dynamic update
    const fields = {};
    if (name !== undefined) fields.name = name;
    if (description !== undefined) fields.description = description;
    if (price !== undefined) fields.price = price;
    if (stock_quantity !== undefined) fields.stock_quantity = stock_quantity;
    if (category !== undefined) fields.category = category;

    // Handle image — only update if a new file was uploaded
    if (req.file) {
        fields.image_path = `uploads/${req.file.filename}`;
    }

    // If preferences is a string (from FormData), parse it
    if (preferences !== undefined) {
        if (typeof preferences === 'string') {
            try {
                fields.preferences = JSON.parse(preferences);
            } catch (e) {
                fields.preferences = preferences.split(',').map(p => p.trim());
            }
        } else {
            fields.preferences = preferences;
        }
    }

    try {
        const updatedProduct = await Product.update(id, fields);
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

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
        res.status(500).json({ error: error.message });
    }
};
