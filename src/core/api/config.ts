const API_BASE_URL = import.meta.env.VITE_API_URL ?? "";

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 20_000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
} as const;
