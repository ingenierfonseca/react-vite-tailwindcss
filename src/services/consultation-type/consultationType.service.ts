import type { ConsultationType } from "@/models/consultation.type";
import { ENDPOINTS } from "../../api/endpoints";
import { createCatalogService } from "../baseCatalogService";

export const ConsultationTypeService = createCatalogService<ConsultationType>(ENDPOINTS.CONSULTATION_TYPE);
