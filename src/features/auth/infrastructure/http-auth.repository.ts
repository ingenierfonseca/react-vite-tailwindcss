import type { AxiosInstance } from "axios";
import type { AuthRepository } from "../domain/auth.repository";
import type { LoginCredentials, UserProfile } from "../domain/auth.types";
import type { LoginApiResponse, UserProfileResponse } from "./auth.dto";

export interface AuthEndpoints {
  LOGIN: string;
  REFRESH: string;
  LOGOUT: string;
  PROFILE: string;
  CSRF: string;
}

/** Translates this backend's DTOs into the auth domain models. */
export function createHttpAuthRepository(
  http: AxiosInstance,
  endpoints: AuthEndpoints,
): AuthRepository {
  return {
    async login(credentials: LoginCredentials) {
      const { data } = await http.post<LoginApiResponse>(endpoints.LOGIN, credentials);
      return { 
        accessToken: data.token, 
        refreshToken: data.refreshToken, 
        csrfToken: data.csrfToken,
        userId: data.userId,
        userName: data.username,
        email: data.email!,
        roles: data.roles,
        permissions: data.permissions,
        staffId: data.staffId!,
        firstName: data.firstName,
        lastName: data.lastName,
        staffTypeName: data.staffTypeName!,
        avatar: data.avatar!
      };
    },

    async getCsrfToken() {
      const { data } = await http.get<{ csrfToken: string }>(endpoints.CSRF);
      return data.csrfToken;
    },

    async getCurrentUser(): Promise<UserProfile> {
      const { data } = await http.get<UserProfileResponse>(endpoints.PROFILE);
      return {
        id: data.id,
        userName: data.username,
        email: data.email,
        roles: data.roles,
        permissions: data.permissions,
        staffId: data.staffId,
        firstName: data.firstName,
        lastName: data.lastName,
        staffTypeName: data.staffTypeName,
        avatar: data.avatar,
      };
    },

    async logout() {
      await http.post(endpoints.LOGOUT);
    },
  };
}
