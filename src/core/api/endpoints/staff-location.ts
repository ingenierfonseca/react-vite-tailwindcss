export const STAFF_LOCATION_ENDPOINTS = {
  BRANCHES: "/branches",
  BRANCH_CREATE: "/branches",
  BRANCH: (id: number) => `/branches/${id}`,
  BRANCH_STAFF_ASSIGNMENTS: "/branches/staff-assignments",
  BRANCH_ASSIGN_STAFF: (branchId: number, staffId: number) => `/branches/${branchId}/staff/${staffId}`,
  STAFF_LOCATIONS_LATEST: "/staff-locations/latest",
  STAFF_LOCATION_REPORT_MINE: "/staff-locations/me",
} as const;
