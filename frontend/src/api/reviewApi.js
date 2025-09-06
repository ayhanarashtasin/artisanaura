import { api } from './client';

export const reviewApi = {
  getProductReviews: async (productId) => {
    const res = await api.get(`/reviews/product/${productId}`);
    return res.data;
  },
  getShopReviews: async (sellerId) => {
    const res = await api.get(`/reviews/shop/${sellerId}`);
    return res.data;
  },
  addProductReview: async (productId, payload, images = []) => {
    const form = new FormData();
    Object.entries(payload || {}).forEach(([k, v]) => form.append(k, v));
    (images || []).forEach((file) => form.append('images', file));
    const res = await api.post(`/reviews/product/${productId}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data;
  },
  addShopReview: async (sellerId, payload, images = []) => {
    const form = new FormData();
    Object.entries(payload || {}).forEach(([k, v]) => form.append(k, v));
    (images || []).forEach((file) => form.append('images', file));
    const res = await api.post(`/reviews/shop/${sellerId}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data;
  },
};


