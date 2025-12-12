// import axios from 'axios';

// // Create axios instance with base URL
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   timeout: 30000,
// });

// // Add response interceptor for better error handling
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error('API Error:', error.message);
    
//     if (error.response) {
//       console.error('Response error:', error.response.status, error.response.data);
//     } else if (error.request) {
//       console.error('No response received');
//     }
    
//     return Promise.reject(error);
//   }
// );

// // Authentication API
// // export const authAPI = {
// //   login: (email) => api.post('/auth/login', { email }),
// // };

// export const authAPI = {
//   sendOtp: (email) => api.post('/auth/send-otp', { email }),
//   verifyOtp: (email, otp) => api.post('/auth/verify-otp', { email, otp }),
//   resendOtp: (email) => api.post('/auth/resend-otp', { email }),
//     login: (email) => api.post('/auth/login', { email }),

// };

// // Stock API
// export const stockAPI = {
//   getSupportedStocks: () => api.get('/stocks/supported'),
//   getStockPrices: () => api.get('/stocks/prices'),
// };

// // Subscription API
// export const subscriptionAPI = {
//   subscribe: (userId, symbol) => api.post('/subscriptions/subscribe', { userId, symbol }),
//   unsubscribe: (userId, symbol) => api.post('/subscriptions/unsubscribe', { userId, symbol }),
//   getUserSubscriptions: (userId) => api.get(`/subscriptions/user/${userId}`),
// };

// // CHART API - REMOVE THIS SECTION since we'll use WebSocket directly

// export default api;

import axios from 'axios';

// Create axios instance with base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message);
    
    if (error.response) {
      // Server responded with error
      console.error('Response error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('No response received');
    }
    
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: (email) => api.post('/auth/login', { email }),
  sendOtp: (email) => api.post('/auth/send-otp', { email }),
  verifyOtp: (email, otp) => api.post('/auth/verify-otp', { email, otp }),
  resendOtp: (email) => api.post('/auth/resend-otp', { email }),
};

// Stock API
export const stockAPI = {
  getSupportedStocks: () => api.get('/stocks/supported'),
  getStockPrices: () => api.get('/stocks/prices'),
};

// Subscription API
export const subscriptionAPI = {
  subscribe: (userId, symbol) => api.post('/subscriptions/subscribe', { userId, symbol }),
  unsubscribe: (userId, symbol) => api.post('/subscriptions/unsubscribe', { userId, symbol }),
  getUserSubscriptions: (userId) => api.get(`/subscriptions/user/${userId}`),
};

// Chart API - SIMPLIFIED
export const chartAPI = {
  getChartData: (symbol, timeframe) => 
    api.get(`/charts/${symbol}`, { 
      params: { timeframe },
      timeout: 15000 // 15 second timeout for charts
    }),
    
  // Health check
  healthCheck: () => api.get('/charts/health')
};

export default api;