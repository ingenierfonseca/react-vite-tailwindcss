
export const Role = {
  SuperAdmin: "SuperAdmin",
  Admin: "Admin",
  Doctor: "Doctor",
  Recepcionista: "Recepcionista",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export interface User {
  id: number;
  name: string;
  email?: string;
  roles: string[];
  permissions?: string[];
  staffId?: number | null;
}

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

export interface LoginCredentials {
  userName: string;
  password: string;
}

export interface LoginApiResponse {
  token: string;
  refreshToken: string;
  username: string;
  roles: string[];
  permissions: string[];
  userId: number;
  staffId: number | null;
}

export interface UserProfileResponse {
  id: number;
  username: string;
  email: string;
  roles: string[];
  permissions: string[];
  isActive: boolean;
  staffId: number | null;
  firstName: string
  lastName: string
  avatar?: string
  staffTypeName?: string
}
