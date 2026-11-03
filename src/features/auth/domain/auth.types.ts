export interface LoginCredentials {
  userName: string;
  password: string;
}

/** User-facing auth model. Backend-specific fields are mapped by the HTTP adapter. */
export interface UserProfile {
  id: number;
  userName: string;
  email?: string;
  roles: string[];
  permissions?: string[];
  staffId?: number | null;
  firstName: string;
  lastName: string;
  staffTypeName?: string;
  avatar?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
