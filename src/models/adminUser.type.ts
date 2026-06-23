export interface AdminUser {
  id: number;
  username: string;
  email: string;
  password?: string;
  roles: string[];
  permissions: string[];
  isActive: boolean;
}
