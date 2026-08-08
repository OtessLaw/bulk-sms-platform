import axios from 'axios';

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && !envUrl.includes('bulk-sms-platform.onrender.com')) {
    return envUrl.endsWith('/api') ? envUrl : `${envUrl.replace(/\/$/, '')}/api`;
  }
  return 'https://fasreach-backend.onrender.com/api';
};

const API = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30000, // 30s timeout for cold start connections
});

// Request interceptor to attach JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for unauthorized handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('cachedUser');
        localStorage.removeItem('cachedWallet');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
