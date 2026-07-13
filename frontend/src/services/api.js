import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || err.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const transactionApi = {
  getAll: () => api.get('/transactions').then(r => r.data.transactions),
  getById: (id) => api.get(`/transactions/${id}`).then(r => r.data.transaction),
  create: (data) => api.post('/transactions', data).then(r => r.data.transaction),
  delete: (id) => api.delete(`/transactions/${id}`).then(r => r.data),
  verify: (id) => api.get(`/transactions/${id}/verify`).then(r => r.data),
  export: () => api.get('/transactions/export').then(r => r.data.transactions),
};

export const walletApi = {
  getBalance: (address) => api.get(`/wallet/${encodeURIComponent(address)}`).then(r => r.data.wallet),
};

export const statsApi = {
  get: () => api.get('/stats').then(r => r.data.stats),
};

export const searchApi = {
  search: (wallet) => api.get('/search', { params: { wallet } }).then(r => r.data.transactions),
};

export default api;
