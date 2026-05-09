import { ENDPOINTS } from "../../api/endpoints";
import { createCatalogService } from "../baseCatalogService";
import type { ClinicalSession } from "./clinicalSession.type";

export const ClinicalSessionService = createCatalogService<ClinicalSession>(ENDPOINTS.CLINICALSESSION);