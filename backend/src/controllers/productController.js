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
    const { name, description, price, stock_quantity, category, preferences } = req.body;
    const imagePath = req.file ? req.file.path : (req.body.image || null);

    try {
        const newProduct = await Product.create(name, description, price, stock_quantity, imagePath, category, preferences);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
