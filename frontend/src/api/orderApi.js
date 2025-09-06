import { api } from './client';

export const orderApi = {
  confirm: async (sessionId, cart) => {
    const res = await api.post('/orders/confirm', { sessionId, cart });
    return res.data;
  },
  sellerOrders: async () => {
    const res = await api.get('/orders/seller');
    return res.data;
  },
  sellerStats: async () => {
    const res = await api.get('/orders/seller/stats');
    return res.data;
  },
  sellerAnalytics: async (params = {}) => {
    const search = new URLSearchParams(params).toString();
    const res = await api.get(`/orders/seller/analytics${search ? `?${search}` : ''}`);
    return res.data;
  },
  buyerOrders: async () => {
    const res = await api.get('/orders/buyer');
    return res.data;
  },
};


