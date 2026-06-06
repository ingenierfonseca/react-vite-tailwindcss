import { ENDPOINTS } from "../../api/endpoints";
import { createCatalogService } from "../baseCatalogService";
import type { Specialty } from "@/models/specialty.type";

export const SpecialtyService = createCatalogService<Specialty>(ENDPOINTS.SPECIALTY);
