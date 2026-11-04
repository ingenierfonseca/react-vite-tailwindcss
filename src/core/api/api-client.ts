import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { API_AUTH_EVENTS, type ApiTokenStorage } from "./auth-token-storage";
import { API_CONFIG } from "./config";
import { AUTH_ENDPOINTS } from "./endpoints/auth";

export interface ApiAuthEndpoints {
  LOGIN: string;
  REFRESH: string;
  LOGOUT: string;
  PROFILE: string;
  CSRF: string;
}

export interface ApiAuthConfig {
  tokenStorage: ApiTokenStorage;
  endpoints?: ApiAuthEndpoints;
  useHttpOnlyCookies?: boolean;
}

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create(API_CONFIG);
let csrfToken: string | null = null;

const browserTokenStorage: ApiTokenStorage = {
  getAccessToken: () => null,
  getRefreshToken: () => null,
  getCsrfToken: () => csrfToken,
  saveAccessToken: () => undefined,
  saveCsrfToken: (token) => { csrfToken = token; },
  clear: () => { csrfToken = null; },
};

let tokenStorage: ApiTokenStorage = browserTokenStorage;
let authEndpoints: ApiAuthEndpoints = AUTH_ENDPOINTS;
let useHttpOnlyCookies = false;

/** Configure the shared HTTP client's auth behavior at the app composition root. */
export function configureApiAuth({
  tokenStorage: storage,
  endpoints,
  useHttpOnlyCookies: cookieAuth = false,
}: ApiAuthConfig) {
  tokenStorage = storage;
  authEndpoints = endpoints ?? AUTH_ENDPOINTS;
  useHttpOnlyCookies = cookieAuth;
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

function isCredentialEndpoint(url = "") {
  return [authEndpoints.LOGIN, authEndpoints.REFRESH, authEndpoints.CSRF].some(
    (endpoint) => url.includes(endpoint),
  );
}

let isRefreshing = false;
let csrfRequest: Promise<string> | null = null;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((request) => {
    if (error) request.reject(error);
    else request.resolve(token ?? "");
  });
  failedQueue = [];
}

async function ensureCsrfToken(): Promise<string> {
  const existing = tokenStorage.getCsrfToken();
  if (existing) return existing;
  if (!csrfRequest) {
    csrfRequest = axios.get<{ csrfToken: string }>(
      `${API_CONFIG.baseURL.replace(/\/$/, "")}${authEndpoints.CSRF}`,
      { timeout: API_CONFIG.timeout, withCredentials: true },
    ).then(({ data }) => {
      tokenStorage.saveCsrfToken(data.csrfToken);
      return data.csrfToken;
    }).finally(() => {
      csrfRequest = null;
    });
  }
  return csrfRequest;
}

api.interceptors.request.use(async (config) => {
  const credentialEndpoint = config.url && isCredentialEndpoint(config.url);
  if (!useHttpOnlyCookies && !credentialEndpoint) {
    const token = tokenStorage.getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }

  const method = config.method?.toUpperCase();
  if (useHttpOnlyCookies && method && !["GET", "HEAD", "OPTIONS"].includes(method)) {
    const csrf = await ensureCsrfToken();
    config.headers["X-CSRF-TOKEN"] = csrf;
  }
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
    if (!refreshToken && !useHttpOnlyCookies) {
      tokenStorage.clear();
      notifySessionExpired();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        if (!useHttpOnlyCookies && token) originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const csrf = tokenStorage.getCsrfToken();
      const { data } = await axios.post<{ token?: string; csrfToken?: string }>(
        `${API_CONFIG.baseURL.replace(/\/$/, "")}${authEndpoints.REFRESH}`,
        refreshToken ? { refreshToken } : {},
        {
          timeout: API_CONFIG.timeout,
          withCredentials: true,
          headers: {
            ...API_CONFIG.headers,
            ...(csrf ? { "X-CSRF-TOKEN": csrf } : {}),
          },
        },
      );
      if (data.csrfToken) tokenStorage.saveCsrfToken(data.csrfToken);
      if (!useHttpOnlyCookies && data.token) tokenStorage.saveAccessToken(data.token);
      processQueue(null, data.token ?? "");
      if (!useHttpOnlyCookies && data.token) originalRequest.headers.Authorization = `Bearer ${data.token}`;
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
