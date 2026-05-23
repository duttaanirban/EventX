import { api, unwrap } from './api';

export const authService = {
  register: (payload) => unwrap(api.post('/auth/register', payload)),
  login: (payload) => unwrap(api.post('/auth/login', payload)),
  logout: () => api.post('/auth/logout'),
  me: () => unwrap(api.get('/auth/me')),
  forgotPassword: (payload) => api.post('/auth/forgot-password', payload),
  resetPassword: (payload) => unwrap(api.post('/auth/reset-password', payload)),
  googleUrl: `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`
};
