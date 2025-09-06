
import axios from 'axios';
import { API_BASE_URL } from './client';

// Backend mounts checkout at "/checkout" (not under "/api").
const API_ROOT = API_BASE_URL.replace(/\/api$/, '');

export const checkoutApi = {
  createSession: async (items) => {
    const res = await axios.post(`${API_ROOT}/checkout`, { items });
    return res.data;
  },
};



