import express from 'express';
import { authenticateToken } from '../middleware/validation.js';
import { confirmOrder, getSellerOrders, getSellerStats, getSellerAnalytics, getBuyerOrders } from '../controllers/orderController.js';

const router = express.Router();

// Confirm an order after payment using a sessionId and cart snapshot
router.post('/confirm', authenticateToken, confirmOrder);

// Get seller orders
router.get('/seller', authenticateToken, getSellerOrders);

// Seller order stats (count and revenue)
router.get('/seller/stats', authenticateToken, getSellerStats);

// Seller analytics
router.get('/seller/analytics', authenticateToken, getSellerAnalytics);

// Get buyer orders
router.get('/buyer', authenticateToken, getBuyerOrders);

export default router;


