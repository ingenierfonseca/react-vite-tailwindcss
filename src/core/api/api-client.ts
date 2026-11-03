import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import {
  API_AUTH_EVENTS,
  API_TOKEN_KEYS,
  type ApiTokenStorage,
} from "./auth-token-storage";
import { API_CONFIG } from "./config";
import { AUTH_ENDPOINTS } from "./endpoints/auth";

export interface ApiAuthEndpoints {
  LOGIN: string;
  REFRESH: string;
  LOGOUT: string;
  PROFILE: string;
}

export interface ApiAuthConfig {
  tokenStorage: ApiTokenStorage;
  endpoints?: ApiAuthEndpoints;
}

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create(API_CONFIG);

const browserTokenStorage: ApiTokenStorage = {
  getAccessToken: () => localStorage.getItem(API_TOKEN_KEYS.ACCESS),
  getRefreshToken: () => localStorage.getItem(API_TOKEN_KEYS.REFRESH),
  saveAccessToken: (token) => localStorage.setItem(API_TOKEN_KEYS.ACCESS, token),
  clear: () => {
    localStorage.removeItem(API_TOKEN_KEYS.ACCESS);
    localStorage.removeItem(API_TOKEN_KEYS.REFRESH);
  },
};

let tokenStorage: ApiTokenStorage = browserTokenStorage;
let authEndpoints: ApiAuthEndpoints = AUTH_ENDPOINTS;

/** Configure the shared HTTP client's auth behavior at the app composition root. */
export function configureApiAuth({ tokenStorage: storage, endpoints }: ApiAuthConfig) {
  tokenStorage = storage;
  authEndpoints = endpoints ?? AUTH_ENDPOINTS;
}

function notifySessionExpired() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(API_AUTH_EVENTS.SESSION_EXPIRED));
  }
}

function isAuthEndpoint(url = "") {
  return [authEndpoints.LOGIN, authEndpoints.REFRESH, authEndpoints.LOGOUT].some(
    (endpoint) => url.includes(endpoint),
  );
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((request) => {
    if (error || !token) {
      request.reject(error);
    } else {
      request.resolve(token);
    }
  });
  failedQueue = [];
}

api.interceptors.request.use((config) => {
  if (config.url && [authEndpoints.LOGIN, authEndpoints.REFRESH].some((endpoint) => config.url?.includes(endpoint))) {
    return config;
  }
  const token = tokenStorage.getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthEndpoint(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
      tokenStorage.clear();
      notifySessionExpired();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post<{ token: string }>(
        `${API_CONFIG.baseURL.replace(/\/$/, "")}${authEndpoints.REFRESH}`,
        { refreshToken },
        { timeout: API_CONFIG.timeout, headers: API_CONFIG.headers },
      );
      tokenStorage.saveAccessToken(data.token);
      processQueue(null, data.token);
      originalRequest.headers.Authorization = `Bearer ${data.token}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      tokenStorage.clear();
      notifySessionExpired();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
