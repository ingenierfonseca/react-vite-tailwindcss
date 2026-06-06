import { ENDPOINTS } from "../../api/endpoints";
import { createCatalogService } from "../baseCatalogService";
import type { ConsultationType } from "../../models/consultationType.type";

export const ConsultationTypeService = createCatalogService<ConsultationType>(ENDPOINTS.CONSULTATIONTYPE);
