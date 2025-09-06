import express from 'express';
import { authenticateToken } from '../middleware/validation.js';
import { getMyShop, getShopBySeller, saveMyShop } from '../controllers/shopController.js';

const router = express.Router();

// GET /api/shop - fetch current user's shop profile
router.get('/', authenticateToken, getMyShop);

// GET /api/shop/seller/:sellerId - public shop info for a seller/user id
router.get('/seller/:sellerId', getShopBySeller);

// POST /api/shop - create/update current user's shop profile
router.post('/', authenticateToken, saveMyShop);

export default router;


