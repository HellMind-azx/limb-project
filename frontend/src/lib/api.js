import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Habits API functions
export const getHabits = async () => {
  const response = await api.get('/habits/');
  return response.data;
};

export const getHabit = async (id) => {
  const response = await api.get(`/habits/${id}/`);
  return response.data;
};

export const createHabit = async (habitData) => {
  const response = await api.post('/habits/', habitData);
  return response.data;
};

export const updateHabit = async (id, habitData) => {
  const response = await api.patch(`/habits/${id}/`, habitData);
  return response.data;
};

export const deleteHabit = async (id) => {
  const response = await api.delete(`/habits/${id}/`);
  return response.data;
};

// Progress API functions
export const getProgress = async (params = {}) => {
  const response = await api.get('/progress/', { params });
  return response.data;
};

export const toggleProgress = async (habitId, date) => {
  const response = await api.post('/progress/toggle/', {
    habit_id: habitId,
    date: date || new Date().toISOString().split('T')[0],
  });
  return response.data;
};

// Stats API function
export const getStats = async () => {
  const response = await api.get('/stats/');
  return response.data;
};

// Categories API functions
export const getCategories = async () => {
  const response = await api.get('/categories/');
  return response.data;
};

export const createCategory = async (categoryData) => {
  const response = await api.post('/categories/', categoryData);
  return response.data;
};

// Auth API functions
export const getProfile = async () => {
  const response = await api.get('/auth/profile/');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put('/auth/profile/', profileData);
  return response.data;
};

export const getPreferences = async () => {
  const response = await api.get('/auth/preferences/');
  return response.data;
};

export const updatePreferences = async (preferencesData) => {
  const response = await api.put('/auth/preferences/', preferencesData);
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await api.post('/auth/change-password/', passwordData);
  return response.data;
};

export default api;
