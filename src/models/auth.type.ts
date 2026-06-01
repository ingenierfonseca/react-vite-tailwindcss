export const Role = {
  Admin: "Admin",
  Doctor: "Doctor",
  Recepcionista: "Recepcionista",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export interface User {
  id: number;
  name: string;
  email?: string;
  role: Role;
  permissions?: string[];
  doctorId?: number | null;
  customerId?: number | null;
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
  doctorId: number | null;
  customerId: number | null;
}

export interface UserProfileResponse {
  id: number;
  username: string;
  email: string;
  roles: string[];
  permissions: string[];
  isActive: boolean;
  doctorId: number | null;
  customerId: number | null;
}
