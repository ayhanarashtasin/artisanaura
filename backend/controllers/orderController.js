import mongoose from 'mongoose';
import {
  confirmOrder as confirmOrderService,
  listSellerOrders as listSellerOrdersService,
  listBuyerOrders as listBuyerOrdersService,
  getSellerStats as getSellerStatsService,
  getSellerAnalytics as getSellerAnalyticsService,
} from '../services/orderService.js';

export const confirmOrder = async (req, res) => {
  try {
    const { sessionId, cart } = req.body || {};
    const result = await confirmOrderService({ sessionId, cart, buyerId: req.user.id });
    if (result.reused) return res.status(200).json({ success: true, order: result.order });
    return res.status(201).json({ success: true, order: result.order });
  } catch (err) {
    const status = err.statusCode || 500;
    console.error('Confirm order error:', err);
    return res.status(status).json({ success: false, message: status === 500 ? 'Failed to confirm order' : err.message });
  }
};

export const getSellerOrders = async (req, res) => {
  try {
    const orders = await listSellerOrdersService({ sellerId: req.user.id });
    return res.json({ success: true, orders });
  } catch (err) {
    const status = err.statusCode || 500;
    console.error('List seller orders error:', err);
    return res.status(status).json({ success: false, message: status === 500 ? 'Failed to load orders' : err.message });
  }
};

export const getSellerStats = async (req, res) => {
  try {
    const stats = await getSellerStatsService({ sellerId: req.user.id });
    return res.json({ success: true, ordersCount: stats.ordersCount, revenue: stats.revenue });
  } catch (err) {
    const status = err.statusCode || 500;
    console.error('Seller stats error:', err);
    return res.status(status).json({ success: false, message: status === 500 ? 'Failed to load stats' : err.message });
  }
};

export const getSellerAnalytics = async (req, res) => {
  try {
    const { from, to, interval } = req.query || {};
    const data = await getSellerAnalyticsService({ sellerId: req.user.id, from, to, interval });
    return res.json({ success: true, ...data });
  } catch (err) {
    const status = err.statusCode || 500;
    console.error('Seller analytics error:', err);
    return res.status(status).json({ success: false, message: status === 500 ? 'Failed to load analytics' : err.message });
  }
};

export const getBuyerOrders = async (req, res) => {
  try {
    const orders = await listBuyerOrdersService({ buyerId: req.user.id });
    return res.json({ success: true, orders });
  } catch (err) {
    const status = err.statusCode || 500;
    console.error('List buyer orders error:', err);
    return res.status(status).json({ success: false, message: status === 500 ? 'Failed to load orders' : err.message });
  }
};


