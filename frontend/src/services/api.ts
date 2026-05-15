import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;

console.log('🔧 API Base URL:', API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear all auth data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('auth_role');
      
      // Determine redirect path based on current location
      const currentPath = window.location.pathname;
      
      // Don't redirect if already on login page
      if (currentPath.includes('/dang-nhap') || currentPath.includes('/login')) {
        return Promise.reject(error);
      }
      
      // Redirect based on role or current path
      if (currentPath.includes('/giao-vien')) {
        window.location.href = '/giao-vien/dang-nhap';
      } else if (currentPath.includes('/admin')) {
        window.location.href = '/admin/login';
      } else if (currentPath.includes('/hoc-vien')) {
        window.location.href = '/dang-nhap';
      } else {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);
