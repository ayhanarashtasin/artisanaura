import express from 'express';
import { getSummary, listUsers, updateUserRole, listProducts, patchProduct, deleteProductAdmin, listOrders, updateOrderStatus, listReviews, deleteReview, listHelp, updateHelpStatus } from '../controllers/adminController.js';
import { authenticateToken, requireAdmin } from '../middleware/validation.js';
import HelpRequest from '../models/HelpRequest.js';

const router = express.Router();

// All admin routes require auth + admin
router.use(authenticateToken, requireAdmin);

// GET /api/admin/summary - basic metrics
router.get('/summary', getSummary);

// GET /api/admin/users
router.get('/users', listUsers);

// PATCH /api/admin/users/:id/role
router.patch('/users/:id/role', updateUserRole);

// GET /api/admin/products
router.get('/products', listProducts);

// PATCH /api/admin/products/:id - update basic product fields
router.patch('/products/:id', patchProduct);

// DELETE /api/admin/products/:id - delete product
router.delete('/products/:id', deleteProductAdmin);

// GET /api/admin/orders
router.get('/orders', listOrders);

// PATCH /api/admin/orders/:id/status - update order status
router.patch('/orders/:id/status', updateOrderStatus);

// GET /api/admin/reviews - list all reviews
router.get('/reviews', listReviews);

// DELETE /api/admin/reviews/:id - delete a review
router.delete('/reviews/:id', deleteReview);

export default router;

// Admin help routes
router.get('/help', listHelp);

router.patch('/help/:id/status', updateHelpStatus);


