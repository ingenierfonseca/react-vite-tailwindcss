import { ENDPOINTS } from "../../api/endpoints";
import { createCatalogService } from "../baseCatalogService";
import type { AppointmentType } from "../types/appointmentType.type";

export const AppointmentTypeService = createCatalogService<AppointmentType>(ENDPOINTS.APPOINTMENTTYPE);