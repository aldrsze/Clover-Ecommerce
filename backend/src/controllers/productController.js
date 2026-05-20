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
