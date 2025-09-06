import {
  getSummary as getSummaryService,
  listUsers as listUsersService,
  updateUserRole as updateUserRoleService,
  listProducts as listProductsService,
  patchProduct as patchProductService,
  deleteProduct as deleteProductService,
  listOrders as listOrdersService,
  updateOrderStatus as updateOrderStatusService,
  listReviews as listReviewsService,
  deleteReview as deleteReviewService,
  listHelp as listHelpService,
  updateHelpStatus as updateHelpStatusService,
} from '../services/adminService.js';

export const getSummary = async (_req, res) => {
  try {
    const data = await getSummaryService();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Admin summary error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const listUsers = async (_req, res) => {
  try {
    const users = await listUsersService();
    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.error('Admin users error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await updateUserRoleService({ userId: req.params.id, role });
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Admin update role error:', error);
    const status = error.statusCode || 500;
    return res.status(status).json({ success: false, message: status === 500 ? 'Internal server error' : error.message });
  }
};

export const listProducts = async (_req, res) => {
  try {
    const products = await listProductsService();
    return res.status(200).json({ success: true, products });
  } catch (error) {
    console.error('Admin products error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const patchProduct = async (req, res) => {
  try {
    const product = await patchProductService({ productId: req.params.id, patch: req.body });
    return res.status(200).json({ success: true, product });
  } catch (error) {
    console.error('Admin update product error:', error);
    const status = error.statusCode || 500;
    return res.status(status).json({ success: false, message: status === 500 ? 'Internal server error' : error.message });
  }
};

export const deleteProductAdmin = async (req, res) => {
  try {
    await deleteProductService({ productId: req.params.id });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Admin delete product error:', error);
    const status = error.statusCode || 500;
    return res.status(status).json({ success: false, message: status === 500 ? 'Internal server error' : error.message });
  }
};

export const listOrders = async (_req, res) => {
  try {
    const orders = await listOrdersService();
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Admin orders error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body || {};
    const order = await updateOrderStatusService({ orderId: req.params.id, status });
    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Admin update order status error:', error);
    const status = error.statusCode || 500;
    return res.status(status).json({ success: false, message: status === 500 ? 'Internal server error' : error.message });
  }
};

export const listReviews = async (_req, res) => {
  try {
    const reviews = await listReviewsService();
    return res.status(200).json({ success: true, reviews });
  } catch (error) {
    console.error('Admin list reviews error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const deleteReview = async (req, res) => {
  try {
    await deleteReviewService({ reviewId: req.params.id });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Admin delete review error:', error);
    const status = error.statusCode || 500;
    return res.status(status).json({ success: false, message: status === 500 ? 'Internal server error' : error.message });
  }
};

export const listHelp = async (_req, res) => {
  try {
    const items = await listHelpService();
    return res.status(200).json({ success: true, items });
  } catch (e) {
    console.error('Admin list help error:', e);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const updateHelpStatus = async (req, res) => {
  try {
    const { status } = req.body || {};
    const updated = await updateHelpStatusService({ helpId: req.params.id, status });
    return res.status(200).json({ success: true, item: updated });
  } catch (e) {
    console.error('Admin update help status error:', e);
    const status = e.statusCode || 500;
    return res.status(status).json({ success: false, message: status === 500 ? 'Internal server error' : e.message });
  }
};


