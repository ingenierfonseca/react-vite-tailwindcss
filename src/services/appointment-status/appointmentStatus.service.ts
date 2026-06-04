import { ENDPOINTS } from "../../api/endpoints";
import { createCatalogService } from "../baseCatalogService";
import type { AppointmentStatus } from "../../models/appointmentStatus.type";

export const AppointmentStatusService = createCatalogService<AppointmentStatus>(ENDPOINTS.APPOINTMENTSTATUS);
