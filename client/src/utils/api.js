import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('token');
      // Only redirect if we are not already on public auth pages
      const publicPaths = ['/login', '/register', '/forgot-password'];
      const isPublicAuthPage = publicPaths.includes(window.location.pathname) || window.location.pathname.startsWith('/reset-password');
      if (!isPublicAuthPage) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;


