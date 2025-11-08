import axios from 'axios';

// Secure storage utilities
const secureStorage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(atob(item)) : null;
    } catch {
      return localStorage.getItem(key);
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, btoa(JSON.stringify(value)));
    } catch {
      localStorage.setItem(key, value);
    }
  },
  remove: (key) => localStorage.removeItem(key)
};

// Determine the correct base URL based on environment
const getBaseUrl = () => {
  // Check if we have an environment variable first
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // Auto-detect based on hostname
  const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

  if (isProduction) {
    // Production - backend deployed on Render
    return 'https://unhbackend.onrender.com';
  }

  // For local development
  return 'http://localhost:5000';
};

// Log the API base URL for debugging
const apiBaseUrl = getBaseUrl();
console.log('Environment Detection:', {
  hostname: window.location.hostname,
  isProduction: window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1',
  envVariable: import.meta.env.VITE_API_BASE_URL,
  prodMode: import.meta.env.PROD,
  finalApiUrl: apiBaseUrl
});
console.log('API Base URL:', apiBaseUrl);

// Create axios instance with base URL and security headers
const axiosInstance = axios.create({
  baseURL: `${apiBaseUrl}/api`,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false // Disable cookies for cross-origin requests
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from secure storage
    const token = secureStorage.get('authToken') || localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for monitoring
    config.metadata = { startTime: Date.now() };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Log response time
    if (response.config.metadata) {
      const duration = Date.now() - response.config.metadata.startTime;
      console.log(`API ${response.config.method.toUpperCase()} ${response.config.url} - ${duration}ms`);
    }
    return response;
  },
  (error) => {
    // Handle errors
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', {
        status: error.response.status,
        message: error.response.data?.message || error.message,
        url: error.config?.url
      });

      // Handle unauthorized errors
      if (error.response.status === 401) {
        // Clear auth data
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        
        // Redirect to login if not already there
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.message);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);

// API endpoints
const api = {
  // Auth endpoints
  auth: {
    register: (userData) => axiosInstance.post('/auth/register', userData),
    login: (credentials) => axiosInstance.post('/auth/login', credentials),
    getProfile: () => axiosInstance.get('/auth/me'),
    updateProfile: (userData) => axiosInstance.put('/auth/updateprofile', userData),
    updatePassword: (passwordData) => axiosInstance.put('/auth/updatepassword', passwordData),
  },

  // Product endpoints
  products: {
    getAll: (params) => axiosInstance.get('/products', { params }),
    getById: (id) => axiosInstance.get(`/products/${id}`),
    getFeatured: () => axiosInstance.get('/products/featured'),
    create: (productData) => axiosInstance.post('/products', productData),
    update: (id, productData) => axiosInstance.put(`/products/${id}`, productData),
    delete: (id) => axiosInstance.delete(`/products/${id}`),
  },

  // Category endpoints
  categories: {
    getAll: () => axiosInstance.get('/categories'),
    getById: (id) => axiosInstance.get(`/categories/${id}`),
    create: (categoryData) => axiosInstance.post('/categories', categoryData),
    update: (id, categoryData) => axiosInstance.put(`/categories/${id}`, categoryData),
    delete: (id) => axiosInstance.delete(`/categories/${id}`),
  },

  // Order endpoints
  orders: {
    getAll: (params) => axiosInstance.get('/orders', { params }),
    getById: (id) => axiosInstance.get(`/orders/${id}`),
    create: (orderData) => axiosInstance.post('/orders', orderData),
    updateStatus: (id, statusData) => axiosInstance.put(`/orders/${id}/status`, statusData),
    updatePayment: (id, paymentData) => axiosInstance.put(`/orders/${id}/payment`, paymentData),
    cancel: (id, reason) => axiosInstance.put(`/orders/${id}/cancel`, { reason }),
  },

  // Contact endpoints
  contact: {
    submit: (messageData) => axiosInstance.post('/contact', messageData),
    getAll: (params) => axiosInstance.get('/contact', { params }),
    getById: (id) => axiosInstance.get(`/contact/${id}`),
    reply: (id, replyData) => axiosInstance.put(`/contact/${id}/reply`, replyData),
    delete: (id) => axiosInstance.delete(`/contact/${id}`),
  },
};

export default api;
export { axiosInstance, secureStorage };

