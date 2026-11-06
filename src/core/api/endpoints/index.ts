import { AUTH_ENDPOINTS } from "./auth";
import { CATALOG_ENDPOINTS } from "./catalog";
import { CLINICAL_ENDPOINTS } from "./clinical";
import { OPERATIONS_ENDPOINTS } from "./operations";
import { SETTINGS_ENDPOINTS } from "./settings";
import { CREDIT_ENDPOINTS } from "./credit";
import { STAFF_LOCATION_ENDPOINTS } from "./staff-location";
import { GEOGRAPHY_ENDPOINTS } from "./geography";
import { TERMINOLOGY_ENDPOINTS } from "./terminology";

export { AUTH_ENDPOINTS } from "./auth";
export { CATALOG_ENDPOINTS } from "./catalog";
export { CLINICAL_ENDPOINTS } from "./clinical";
export { OPERATIONS_ENDPOINTS } from "./operations";
export { SETTINGS_ENDPOINTS } from "./settings";
export { CREDIT_ENDPOINTS } from "./credit";
export { STAFF_LOCATION_ENDPOINTS } from "./staff-location";
export { GEOGRAPHY_ENDPOINTS } from "./geography";

/** Central endpoint catalog. Flat keys remain for compatibility with services. */
export const ENDPOINTS = {
  ...AUTH_ENDPOINTS,
  AUTH: AUTH_ENDPOINTS,
  ...CATALOG_ENDPOINTS,
  ...CLINICAL_ENDPOINTS,
  ...OPERATIONS_ENDPOINTS,
  ...SETTINGS_ENDPOINTS,
  ...CREDIT_ENDPOINTS,
  ...STAFF_LOCATION_ENDPOINTS,
  ...GEOGRAPHY_ENDPOINTS,
  CREDIT: CREDIT_ENDPOINTS,
  STAFF_LOCATION: STAFF_LOCATION_ENDPOINTS,
  GEOGRAPHY: GEOGRAPHY_ENDPOINTS,
  TERMINOLOGY: TERMINOLOGY_ENDPOINTS
} as const;
