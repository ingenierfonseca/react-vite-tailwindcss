import api from "../../api/api";
import { ENDPOINTS } from "../../api/endpoints";
import { createCatalogService } from "../baseCatalogService";
import type { RolePermission } from "../../models/rolePermission.type";
import type { PaginatedResponse } from "../../models/paginatedResponse";

const baseService = createCatalogService<RolePermission>(ENDPOINTS.ROLEPERMISSION);

export const RolePermissionService = {
  ...baseService,
  delete: async (id: number): Promise<void> => {
    await api.delete(`${ENDPOINTS.ROLEPERMISSION}${id}`);
  },
  getByRoleId: async (roleId: number): Promise<RolePermission[]> => {
    const { data } = await api.get(`${ENDPOINTS.ROLEPERMISSION}${roleId}`);
    if (Array.isArray(data)) return data;
    if ((data as PaginatedResponse<RolePermission>).data) return (data as PaginatedResponse<RolePermission>).data;
    return [];
  },
};
