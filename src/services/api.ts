import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('[API Error]', err.response?.data ?? err.message);
    return Promise.reject(err);
  }
);
