import axios from 'axios';

export const API_BASE_URL = 'http://localhost:3000/api';

export const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && token !== 'null' && token !== 'undefined') {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (config.headers && 'Authorization' in config.headers) {
    delete config.headers.Authorization;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 && !error.config.__isRetry) {
      return axios
        .post('http://localhost:3000/api/refresh', {}, { withCredentials: true })
        .then((res) => {
          if (res?.data?.success && res?.data?.token) {
            localStorage.setItem('token', res.data.token);
            error.config.headers.Authorization = `Bearer ${res.data.token}`;
            error.config.__isRetry = true;
            return api.request(error.config);
          }
          return Promise.reject(error);
        })
        .catch(() => {
          try {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('staySignedIn');
          } catch (_) {}
          if (
            typeof window !== 'undefined' &&
            window.location &&
            !window.location.pathname.startsWith('/signin')
          ) {
            window.location.href = '/signin?session=expired';
          }
          return Promise.reject(error);
        });
    }
    return Promise.reject(error);
  }
);


