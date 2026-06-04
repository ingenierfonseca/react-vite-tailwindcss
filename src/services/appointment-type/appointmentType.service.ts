import { ENDPOINTS } from "../../api/endpoints";
import { createCatalogService } from "../baseCatalogService";
import type { AppointmentType } from "../../models/appointmentType.type";

export const AppointmentTypeService = createCatalogService<AppointmentType>(ENDPOINTS.APPOINTMENTTYPE);