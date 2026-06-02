import { ENDPOINTS } from "../../api/endpoints";
import { createCatalogService } from "../baseCatalogService";
import type { Permission } from "../../models/permission.type";

export const PermissionService = createCatalogService<Permission>(ENDPOINTS.PERMISSION);
