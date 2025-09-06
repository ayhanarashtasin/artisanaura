import express from 'express';
import { authenticateToken } from '../middleware/validation.js';
import { getProductReviews, getShopReviews, createProductReview, createShopReview } from '../controllers/reviewController.js';
import multer from 'multer';

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 4 },
  fileFilter: (req, file, cb) => {
    const ok = String(file.mimetype || '').startsWith('image/');
    cb(ok ? null : new Error('Only image files are allowed'), ok);
  },
});

// Get reviews for a product
router.get('/product/:productId', getProductReviews);

// Get reviews for a shop (seller user id)
router.get('/shop/:sellerId', getShopReviews);

// Post a product review
router.post('/product/:productId', authenticateToken, upload.array('images', 4), createProductReview);

// Post a shop review
router.post('/shop/:sellerId', authenticateToken, upload.array('images', 4), createShopReview);

export default router;


