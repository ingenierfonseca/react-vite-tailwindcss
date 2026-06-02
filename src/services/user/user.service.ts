import { ENDPOINTS } from "../../api/endpoints";
import { createCatalogService } from "../baseCatalogService";
import type { AdminUser } from "../../models/adminUser.type";

export const UserService = createCatalogService<AdminUser>(ENDPOINTS.USER);
