import { ENDPOINTS } from "../../api/endpoints";
import { createCatalogService } from "../baseCatalogService";
import type { Doctor } from "./doctor.type";

export const DoctorService = createCatalogService<Doctor>(ENDPOINTS.DOCTOR);