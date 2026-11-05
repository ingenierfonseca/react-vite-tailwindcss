export const GEOGRAPHY_ENDPOINTS = {
  DEPARTMENTS: "/geography/departments",
  CITIES_FOR_DEPARTMENT: (departmentId: number) => `/geography/departments/${departmentId}/cities`,
} as const;
