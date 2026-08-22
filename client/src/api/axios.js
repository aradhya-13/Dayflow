/**
 * Pre-configured axios instance.
 * Teammates import this instead of plain axios so the token is always sent.
 *
 * Usage:
 *   import api from '../api/axios';
 *   const { data } = await api.get('/users/me');
 */
import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

// Attach JWT from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401, clear storage and redirect to sign-in
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/signin';
    }
    return Promise.reject(err);
  }
);

export default api;
