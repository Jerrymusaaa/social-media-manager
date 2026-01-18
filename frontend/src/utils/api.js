import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');

// AI APIs
export const generateCaption = (data) => api.post('/ai/generate-caption', data);
export const regenerateCaption = (data) => api.post('/ai/regenerate-caption', data);

// Post APIs
export const createPost = (formData) => api.post('/posts', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const getPosts = (params) => api.get('/posts', { params });
export const getPost = (id) => api.get(`/posts/${id}`);
export const updatePost = (id, formData) => api.put(`/posts/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deletePost = (id) => api.delete(`/posts/${id}`);
export const getAnalytics = (params) => api.get('/posts/analytics', { params });
export const getScheduledPosts = (params) => api.get('/posts/scheduled', { params });

export default api;