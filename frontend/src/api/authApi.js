import axios from 'axios';
import { api, API_BASE_URL } from './client';

export const authApi = {
	getMe: async () => {
		const response = await api.get('/me');
		return response.data;
	},
	getShop: async () => {
		const response = await api.get('/shop');
		return response.data;
	},
	saveShop: async (payload) => {
		const response = await api.post('/shop', payload);
		return response.data;
	},
    getShopBySeller: async (sellerId) => {
        const response = await api.get(`/shop/seller/${sellerId}`);
        return response.data;
    },
	updateEmail: async (payload) => {
		try {
			// For this endpoint we do not require token; use a raw axios call without interceptor header
			const response = await axios.post(`${API_BASE_URL}/update-email`, payload);
			return response.data;
		} catch (error) {
			return error?.response?.data || { success: false, message: 'Network error' };
		}
	},
	verifyEmail: async (payload) => {
		const response = await api.post('/verify-email', payload);
		return response.data;
	},
	resendVerification: async (payload) => {
		const response = await api.post('/resend-verification', payload);
		return response.data;
	},
	// No verification flow needed now
    logout: async () => {
        try {
            await axios.post(`${API_BASE_URL}/logout`, {}, { withCredentials: true });
            return { success: true };
        } catch (e) {
            return { success: false };
        }
    },
    logoutAll: async () => {
        try {
            await api.post('/logout-all');
            try { await axios.post(`${API_BASE_URL}/logout`, {}, { withCredentials: true }); } catch (_) {}
            return { success: true };
        } catch (e) {
            return { success: false };
        }
    },
};


