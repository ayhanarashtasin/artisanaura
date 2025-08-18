import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
	baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem('token');
	if (token && token !== 'null' && token !== 'undefined') {
		config.headers.Authorization = `Bearer ${token}`;
	} else {
		if (config.headers && 'Authorization' in config.headers) {
			delete config.headers.Authorization;
		}
	}
	return config;
});

export const authApi = {
	getMe: async () => {
		const response = await api.get('/me');
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
};


