import api from "../../api/api";
import { ENDPOINTS } from "../../api/endpoints";
import { createCatalogService } from "../baseCatalogService";
import type { RolePermission } from "../../models/rolePermission.type";

const baseService = createCatalogService<RolePermission>(ENDPOINTS.ROLEPERMISSION);

export const RolePermissionService = {
  ...baseService,
  delete: async (id: number): Promise<void> => {
    await api.delete(`${ENDPOINTS.ROLEPERMISSION}${id}`);
  },
};
