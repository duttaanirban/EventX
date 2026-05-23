import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('eventx_access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original?._retry && localStorage.getItem('eventx_access_token')) {
      original._retry = true;
      try {
        const { data } = await api.post('/auth/refresh');
        localStorage.setItem('eventx_access_token', data.data.accessToken);
        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(original);
      } catch (_refreshError) {
        localStorage.removeItem('eventx_access_token');
        localStorage.removeItem('eventx_user');
      }
    }
    return Promise.reject(error);
  }
);

export const unwrap = (promise) => promise.then((response) => response.data.data);
