import { api } from './client';

export const adminApi = {
  getSummary: async () => {
    const res = await api.get('/admin/summary');
    return res.data;
  },
  getUsers: async () => {
    const res = await api.get('/admin/users');
    return res.data;
  },
  updateUserRole: async (userId, role) => {
    const res = await api.patch(`/admin/users/${userId}/role`, { role });
    return res.data;
  },
  getProducts: async () => {
    const res = await api.get('/admin/products');
    return res.data;
  },
  updateProduct: async (id, payload) => {
    const res = await api.patch(`/admin/products/${id}`, payload);
    return res.data;
  },
  deleteProduct: async (id) => {
    const res = await api.delete(`/admin/products/${id}`);
    return res.data;
  },
  getOrders: async () => {
    const res = await api.get('/admin/orders');
    return res.data;
  },
  updateOrderStatus: async (id, status) => {
    const res = await api.patch(`/admin/orders/${id}/status`, { status });
    return res.data;
  },
  getReviews: async () => {
    const res = await api.get('/admin/reviews');
    return res.data;
  },
  deleteReview: async (id) => {
    const res = await api.delete(`/admin/reviews/${id}`);
    return res.data;
  },
};


