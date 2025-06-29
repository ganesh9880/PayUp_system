import axios from 'axios';

// Use environment variable for API URL, fallback to deployed URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://payup-system.onrender.com/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('API Request:', config.method?.toUpperCase(), config.url);
  console.log('Token available:', !!token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Authorization header set');
  } else {
    console.log('No token found in localStorage');
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.config?.url, error.response?.data);
    if (error.response?.status === 401) {
      console.log('Token expired, redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth functions
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// Group functions
export const getGroups = async () => {
  const response = await api.get('/groups');
  return response.data;
};

export const createGroup = async (groupData) => {
  const response = await api.post('/groups', groupData);
  return response.data;
};

export const getGroupDetails = async (groupId) => {
  const response = await api.get(`/groups/${groupId}`);
  return response.data;
};

// Expense functions
export const createExpense = async (groupId, expenseData) => {
  const response = await api.post(`/groups/${groupId}/expenses`, expenseData);
  return response.data;
};

// Balance functions
export const getBalances = async () => {
  const response = await api.get('/groups/balances');
  return response.data;
};

// Settlement functions
export const updateSettlement = async (groupId, expenseId, settlementId, updateData) => {
  const response = await api.put(`/groups/${groupId}/expenses/${expenseId}/settlements/${settlementId}`, updateData);
  return response.data;
};

// Reminder functions
export const sendReminders = async (groupId) => {
  const response = await api.post(`/groups/${groupId}/remind`);
  return response.data;
};

// User functions
export const getUsers = async () => {
  console.log('Calling getUsers API...');
  const response = await api.get('/users');
  console.log('getUsers response:', response.data);
  return response.data;
};

export default api; 