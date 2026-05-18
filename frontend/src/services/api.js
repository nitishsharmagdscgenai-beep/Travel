// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const tripAPI = {
  generate: (data) => api.post("/trips/generate", data),
  getAll: () => api.get("/trips"),
  getById: (id) => api.get(`/trips/${id}`),
  update: (id, data) => api.put(`/trips/${id}`, data),
  delete: (id) => api.delete(`/trips/${id}`),
};

export const aiAPI = {
  chat: (message, context) => api.post("/ai/chat", { message, context }),
  packingSuggestions: (data) => api.post("/ai/packing-suggestions", data),
};

export const weatherAPI = {
  getWeather: (city) => api.get("/weather", { params: { city } }),
  getForecast: (city) => api.get("/weather/forecast", { params: { city } }),
};

export default api;
