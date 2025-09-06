import express from 'express';
import multer from 'multer';
import Product from '../models/Product.js';
import { authenticateToken } from '../middleware/validation.js';
import { createProduct, updateProduct, deleteProduct, getMyProducts, getProductsByCategory, searchProducts } from '../controllers/productController.js';

const router = express.Router();

// --- Multer Config for File Uploads ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// --- API Routes ---

// POST /api/products (Create a new product)
router.post('/', authenticateToken, upload.single('image'), createProduct);

// PUT /api/products/:id (Update a product)
router.put('/:id', authenticateToken, upload.single('image'), updateProduct);

// DELETE /api/products/:id (Delete a product)
router.delete('/:id', authenticateToken, deleteProduct);

// GET /api/products/myshop (Get products for the logged-in user)
router.get('/myshop', authenticateToken, getMyProducts);

// GET /api/products/category/:category/:subcategory (Get products by category)
router.get('/category/:category/:subcategory', getProductsByCategory);

// GET /api/products/search/:query (Search for products)
// This is the corrected search route.
router.get('/search/:query', searchProducts);


export default router;
