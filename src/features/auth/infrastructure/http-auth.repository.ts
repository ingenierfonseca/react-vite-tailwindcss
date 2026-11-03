import type { AxiosInstance } from "axios";
import type { AuthRepository } from "../domain/auth.repository";
import type { LoginCredentials, UserProfile } from "../domain/auth.types";
import { mockLoginApiResponse, mockUserProfileResponse, type LoginApiResponse, type UserProfileResponse } from "./auth.dto";

export interface AuthEndpoints {
  LOGIN: string;
  REFRESH: string;
  LOGOUT: string;
  PROFILE: string;
}

/** Translates this backend's DTOs into the auth domain models. */
export function createHttpAuthRepository(
  http: AxiosInstance,
  endpoints: AuthEndpoints,
): AuthRepository {
  return {
    async login(credentials: LoginCredentials) {
      const { data } = await http.post<LoginApiResponse>(endpoints.LOGIN, credentials);
      //let data = mockLoginApiResponse
      return { accessToken: data.token, refreshToken: data.refreshToken };
    },

    async getCurrentUser(): Promise<UserProfile> {
      const { data } = await http.get<UserProfileResponse>(endpoints.PROFILE);
      //let data = mockUserProfileResponse
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
      try {
        await http.post(endpoints.LOGOUT);
      } catch {
        // Local logout must still complete when the server is unavailable.
      }
    },
  };
}
