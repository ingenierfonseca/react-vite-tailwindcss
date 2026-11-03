import { AUTH_ENDPOINTS } from "./auth";
import { CATALOG_ENDPOINTS } from "./catalog";
import { CLINICAL_ENDPOINTS } from "./clinical";
import { OPERATIONS_ENDPOINTS } from "./operations";

export { AUTH_ENDPOINTS } from "./auth";
export { CATALOG_ENDPOINTS } from "./catalog";
export { CLINICAL_ENDPOINTS } from "./clinical";
export { OPERATIONS_ENDPOINTS } from "./operations";

/** Central endpoint catalog. Flat keys remain for compatibility with services. */
export const ENDPOINTS = {
  ...AUTH_ENDPOINTS,
  AUTH: AUTH_ENDPOINTS,
  ...CATALOG_ENDPOINTS,
  ...CLINICAL_ENDPOINTS,
  ...OPERATIONS_ENDPOINTS,
} as const;
