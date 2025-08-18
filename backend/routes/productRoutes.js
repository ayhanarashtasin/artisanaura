import express from 'express';
import multer from 'multer';
import Product from '../models/Product.js';
import { authenticateToken } from '../middleware/validation.js';

const router = express.Router();

// --- Multer Config for File Uploads ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// --- API Routes ---

// POST /api/products (Create a new product)
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, subcategory } = req.body;
    if (!name || !description || !price || !category || !subcategory || !req.file) {
      return res.status(400).json({ message: 'Please fill all required fields.' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    const newProduct = new Product({ name, description, price, category, subcategory, imageUrl, seller: req.user.id });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error while creating product.' });
  }
});

// PUT /api/products/:id (Update a product)
router.put('/:id', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, subcategory } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Ensure only the owner can update
    if (String(product.seller) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;
    if (subcategory) product.subcategory = subcategory;
    if (req.file) {
      product.imageUrl = `/uploads/${req.file.filename}`;
    }

    const saved = await product.save();
    res.status(200).json(saved);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error while updating product.' });
  }
});

// DELETE /api/products/:id (Delete a product)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (String(product.seller) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await product.deleteOne();
    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error while deleting product.' });
  }
});

// GET /api/products/myshop (Get products for the logged-in user)
router.get('/myshop', authenticateToken, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching user products:', error);
    res.status(500).json({ message: 'Server error while fetching products.' });
  }
});

// GET /api/products/category/:category/:subcategory (Get products by category)
router.get('/category/:category/:subcategory', async (req, res) => {
  try {
    const categoryParam = decodeURIComponent(req.params.category);
    const subcategoryParam = decodeURIComponent(req.params.subcategory);
    const products = await Product.find({
      category: { $regex: new RegExp(`^${categoryParam}$`, 'i') },
      subcategory: { $regex: new RegExp(`^${subcategoryParam}$`, 'i') }
    }).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching category products:', error);
    res.status(500).json({ message: 'Server error while fetching products.' });
  }
});

// GET /api/products/search/:query (Search for products)
// This is the corrected search route.
router.get('/search/:query', async (req, res) => {
  try {
    const searchQuery = req.params.query;
    if (!searchQuery) {
        return res.status(400).json({ message: 'Search query cannot be empty.' });
    }
    
    // Use a case-insensitive regex to find products by name or description
    const products = await Product.find({
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ message: 'Server error while searching for products.' });
  }
});


export default router;
