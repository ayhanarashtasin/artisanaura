import { api } from './client';

export const helpApi = {
  submit: async (payload) => {
    const res = await api.post('/help', payload);
    return res.data;
  },
  mine: async () => {
    const res = await api.get('/help/mine');
    return res.data;
  },
  adminList: async () => {
    const res = await api.get('/admin/help');
    return res.data;
  },
  adminUpdateStatus: async (id, status) => {
    const res = await api.patch(`/admin/help/${id}/status`, { status });
    return res.data;
  }
};


