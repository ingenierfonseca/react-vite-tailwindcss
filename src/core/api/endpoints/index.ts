import { AUTH_ENDPOINTS } from "./auth";
import { CATALOG_ENDPOINTS } from "./catalog";
import { CLINICAL_ENDPOINTS } from "./clinical";
import { OPERATIONS_ENDPOINTS } from "./operations";
import { SETTINGS_ENDPOINTS } from "./settings";

export { AUTH_ENDPOINTS } from "./auth";
export { CATALOG_ENDPOINTS } from "./catalog";
export { CLINICAL_ENDPOINTS } from "./clinical";
export { OPERATIONS_ENDPOINTS } from "./operations";
export { SETTINGS_ENDPOINTS } from "./settings";

/** Central endpoint catalog. Flat keys remain for compatibility with services. */
export const ENDPOINTS = {
  ...AUTH_ENDPOINTS,
  AUTH: AUTH_ENDPOINTS,
  ...CATALOG_ENDPOINTS,
  ...CLINICAL_ENDPOINTS,
  ...OPERATIONS_ENDPOINTS,
  ...SETTINGS_ENDPOINTS,
} as const;
