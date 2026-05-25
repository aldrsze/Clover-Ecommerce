const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const productController = require('../controllers/productController');

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/', productController.getProducts);
router.post('/', upload.single('image'), productController.createProduct);
router.put('/:id', upload.single('image'), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;