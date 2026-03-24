import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7209/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Interceptor request (ej: token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🚨 Interceptor response (errores globales)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      // logout o redirect
    }

    return Promise.reject(error);
  }
);

export default api;