import api from "../../api/api";
import type { LoginCredentials, LoginApiResponse, UserProfileResponse } from "../../models/auth.type";

const AUTH_ENDPOINT = "/auth/";

export const AuthService = {
  login: async (credentials: LoginCredentials): Promise<LoginApiResponse> => {
    const { data } = await api.post<LoginApiResponse>(`${AUTH_ENDPOINT}login`, credentials);
    return data;
  },

  refreshToken: async (refreshToken: string): Promise<{ token: string }> => {
    const { data } = await api.post<{ token: string }>(`${AUTH_ENDPOINT}refresh`, { refreshToken });
    return data;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post(`${AUTH_ENDPOINT}logout`);
    } catch {
      // Ignore logout errors
    }
  },

  getProfile: async (): Promise<UserProfileResponse> => {
    const { data } = await api.get<UserProfileResponse>(`${AUTH_ENDPOINT}me`);
    return data;
  },
};
