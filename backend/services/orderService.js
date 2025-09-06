import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const confirmOrder = async ({ sessionId, cart, buyerId }) => {
  if (!sessionId || !Array.isArray(cart) || cart.length === 0) {
    const err = new Error('Missing sessionId or cart');
    err.statusCode = 400;
    throw err;
  }
  const existing = await Order.findOne({ paymentSessionId: sessionId }).lean();
  if (existing) {
    return { reused: true, order: existing };
  }

  const ids = cart.map((it) => String(it.id));
  const products = await Product.find({ _id: { $in: ids } }).select('name price seller').lean();
  if (products.length === 0) {
    const err = new Error('No matching products');
    err.statusCode = 400;
    throw err;
  }
  const sellerId = products[0].seller;

  const items = products.map((p) => {
    const qty = Math.max(1, Number((cart.find((c) => String(c.id) === String(p._id)) || {}).quantity) || 1);
    return { product: p._id, name: p.name, price: Number(p.price) || 0, quantity: qty };
  });
  const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0);

  const created = await Order.create({
    buyer: buyerId,
    seller: sellerId,
    items,
    total,
    paymentSessionId: sessionId,
    status: 'paid',
  });
  return { reused: false, order: created };
};

export const listSellerOrders = async ({ sellerId }) => {
  return Order.find({ seller: sellerId }).sort({ createdAt: -1 }).lean();
};

export const listBuyerOrders = async ({ buyerId }) => {
  return Order.find({ buyer: buyerId }).sort({ createdAt: -1 }).lean();
};

export const getSellerStats = async ({ sellerId }) => {
  const [stats] = await Order.aggregate([
    { $match: { seller: new mongoose.Types.ObjectId(String(sellerId)) } },
    { $group: { _id: null, ordersCount: { $sum: 1 }, revenue: { $sum: { $ifNull: ['$total', 0] } } } },
  ]);
  return { ordersCount: stats?.ordersCount || 0, revenue: stats?.revenue || 0 };
};

export const getSellerAnalytics = async ({ sellerId, from, to, interval }) => {
  const sellerObjectId = new mongoose.Types.ObjectId(String(sellerId));
  const match = { seller: sellerObjectId };
  if (from) match.createdAt = { ...(match.createdAt || {}), $gte: new Date(from) };
  if (to) match.createdAt = { ...(match.createdAt || {}), $lte: new Date(to) };

  const dateFormat = interval === 'month' ? '%Y-%m' : interval === 'week' ? '%G-%V' : '%Y-%m-%d';
  const revenueOverTime = await Order.aggregate([
    { $match: match },
    { $group: { _id: { $dateToString: { format: dateFormat, date: '$createdAt' } }, revenue: { $sum: { $ifNull: ['$total', 0] } }, orders: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  const topProducts = await Order.aggregate([
    { $match: match },
    { $unwind: '$items' },
    { $group: { _id: '$items.product', name: { $first: '$items.name' }, revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }, quantity: { $sum: '$items.quantity' }, orders: { $sum: 1 } } },
    { $sort: { revenue: -1 } },
    { $limit: 10 },
  ]);

  const byStatus = await Order.aggregate([{ $match: match }, { $group: { _id: '$status', count: { $sum: 1 } } }]);

  const [aovAgg] = await Order.aggregate([{ $match: match }, { $group: { _id: null, revenue: { $sum: { $ifNull: ['$total', 0] } }, orders: { $sum: 1 } } }]);
  const aov = aovAgg && aovAgg.orders > 0 ? aovAgg.revenue / aovAgg.orders : 0;

  return { revenueOverTime, topProducts, byStatus, aov };
};


