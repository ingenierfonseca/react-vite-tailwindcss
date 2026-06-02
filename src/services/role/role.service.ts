import { ENDPOINTS } from "../../api/endpoints";
import { createCatalogService } from "../baseCatalogService";
import type { AppRole } from "../../models/appRole.type";

export const RoleService = createCatalogService<AppRole>(ENDPOINTS.ROLE);
