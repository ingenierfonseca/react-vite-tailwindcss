import { createCatalogService } from "../baseCatalogService";
import type { Staff } from "@/models/staff.type";
import { ENDPOINTS } from "@/api/endpoints";

export const StaffService = createCatalogService<Staff>(ENDPOINTS.STAFF);
