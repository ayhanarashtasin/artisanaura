import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import HelpRequest from '../models/HelpRequest.js';

export const getSummary = async () => {
  const [userCount, productCount, orderCount] = await Promise.all([
    User.countDocuments({}),
    Product.countDocuments({}),
    Order.countDocuments({}),
  ]);
  const recentOrders = await Order.find({}).sort({ createdAt: -1 }).limit(5).select('total status createdAt').lean();
  return { userCount, productCount, orderCount, recentOrders };
};

export const listUsers = async () => {
  return User.find({}).select('-password').sort({ createdAt: -1 }).lean();
};

export const updateUserRole = async ({ userId, role }) => {
  if (!['user', 'admin'].includes(role)) {
    const err = new Error('Invalid role');
    err.statusCode = 400;
    throw err;
  }
  const user = await User.findByIdAndUpdate(userId, { $set: { role } }, { new: true }).select('-password');
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return user;
};

export const listProducts = async () => {
  return Product.find({}).sort({ createdAt: -1 }).lean();
};

export const patchProduct = async ({ productId, patch }) => {
  const allowed = ['name', 'description', 'price', 'category', 'subcategory', 'imageUrl'];
  const update = {};
  for (const key of allowed) if (key in patch) update[key] = patch[key];
  const product = await Product.findByIdAndUpdate(productId, { $set: update }, { new: true });
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  return product;
};

export const deleteProduct = async ({ productId }) => {
  const product = await Product.findByIdAndDelete(productId);
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  return { success: true };
};

export const listOrders = async () => {
  return Order.find({}).sort({ createdAt: -1 }).lean();
};

export const updateOrderStatus = async ({ orderId, status }) => {
  const allowed = ['paid', 'refunded', 'cancelled'];
  if (!allowed.includes(status)) {
    const err = new Error('Invalid status');
    err.statusCode = 400;
    throw err;
  }
  const order = await Order.findByIdAndUpdate(orderId, { $set: { status } }, { new: true });
  if (!order) {
    const err = new Error('Order not found');
    err.statusCode = 404;
    throw err;
  }
  return order;
};

export const listReviews = async () => {
  return Review.find({})
    .populate('user', 'email firstName')
    .populate('product', 'name')
    .populate('shop', 'firstName email')
    .sort({ createdAt: -1 })
    .lean();
};

export const deleteReview = async ({ reviewId }) => {
  const review = await Review.findByIdAndDelete(reviewId);
  if (!review) {
    const err = new Error('Review not found');
    err.statusCode = 404;
    throw err;
  }
  return { success: true };
};

export const listHelp = async () => {
  return HelpRequest.find({}).populate('user', 'email firstName').sort({ createdAt: -1 }).lean();
};

export const updateHelpStatus = async ({ helpId, status }) => {
  if (!['open','in_progress','resolved'].includes(status)) {
    const err = new Error('Invalid status');
    err.statusCode = 400;
    throw err;
  }
  const updated = await HelpRequest.findByIdAndUpdate(helpId, { $set: { status } }, { new: true });
  if (!updated) {
    const err = new Error('Help request not found');
    err.statusCode = 404;
    throw err;
  }
  return updated;
};


