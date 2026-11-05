import { api, ENDPOINTS } from "@/core/api";
import { createStaffLocationRepository } from "@/features/staff-location/infrastructure/staff-location.repository";

export const staffLocationRepository = createStaffLocationRepository(api, ENDPOINTS.STAFF_LOCATION);
