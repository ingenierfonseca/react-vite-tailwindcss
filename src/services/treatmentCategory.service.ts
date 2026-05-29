import { createCatalogService } from "./baseCatalogService";
import type { TreatmentCategory } from "./types/treatmentCategory.type";
import { ENDPOINTS } from "@/api/endpoints";

const method = ENDPOINTS.TREATMENTCATEGORY
const baseService = createCatalogService<TreatmentCategory>(method);

export const TreatmentCategoryService =  {
    ...baseService
}