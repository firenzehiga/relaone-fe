import axios from "axios";

// Base API URL - ubah sesuai dengan backend Anda
const BASE_URL = "http://localhost:8000/api"; // atau URL API Anda

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor untuk menambahkan auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor untuk handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  // Events
  events: {
    getAll: (params) => api.get("/events", { params }),
    getById: (id) => api.get(`/events/${id}`),
    create: (data) => api.post("/events", data),
    update: (id, data) => api.put(`/events/${id}`, data),
    delete: (id) => api.delete(`/events/${id}`),
    join: (id, data) => api.post(`/events/${id}/join`, data),
  },

  // Organizations
  organizations: {
    getAll: (params) => api.get("/organizations", { params }),
    getById: (id) => api.get(`/organizations/${id}`),
    create: (data) => api.post("/organizations", data),
    update: (id, data) => api.put(`/organizations/${id}`, data),
    delete: (id) => api.delete(`/organizations/${id}`),
  },

  // Categories
  categories: {
    getAll: () => api.get("/categories"),
    getById: (id) => api.get(`/categories/${id}`),
  },

  // Auth
  auth: {
    login: (credentials) => api.post("/auth/login", credentials),
    register: (userData) => api.post("/auth/register", userData),
    logout: () => api.post("/auth/logout"),
    me: () => api.get("/auth/me"),
    refreshToken: () => api.post("/auth/refresh"),
  },

  // Users
  users: {
    getProfile: () => api.get("/users/profile"),
    updateProfile: (data) => api.put("/users/profile", data),
    getRegistrations: () => api.get("/users/registrations"),
  },
};

export default api;
