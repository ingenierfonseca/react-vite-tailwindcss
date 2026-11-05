import type { AxiosInstance } from "axios";
import type {
  Branch,
  CreateBranch,
  ReportStaffLocation,
  ReportStaffLocationResult,
  StaffAssignment,
  StaffCurrentLocation,
} from "../domain/staff-location.types";

export interface StaffLocationEndpoints {
  BRANCHES: string;
  BRANCH_CREATE: string;
  BRANCH: (id: number) => string;
  BRANCH_STAFF_ASSIGNMENTS: string;
  BRANCH_ASSIGN_STAFF: (branchId: number, staffId: number) => string;
  STAFF_LOCATIONS_LATEST: string;
  STAFF_LOCATION_REPORT_MINE: string;
}

export function createStaffLocationRepository(http: AxiosInstance, endpoints: StaffLocationEndpoints) {
  return {
    async getBranches(activeOnly = true): Promise<Branch[]> {
      const { data } = await http.get<Branch[]>(endpoints.BRANCHES, { params: { activeOnly } });
      return data;
    },

    async createBranch(request: CreateBranch): Promise<Branch> {
      const { data } = await http.post<Branch>(endpoints.BRANCH_CREATE, request);
      return data;
    },

    async getStaffAssignments(search = ""): Promise<StaffAssignment[]> {
      const { data } = await http.get<StaffAssignment[]>(endpoints.BRANCH_STAFF_ASSIGNMENTS, {
        params: search ? { search } : undefined,
      });
      return data;
    },

    async assignStaff(branchId: number, staffId: number): Promise<StaffAssignment> {
      const { data } = await http.put<StaffAssignment>(endpoints.BRANCH_ASSIGN_STAFF(branchId, staffId));
      return data;
    },

    async getLatestLocations(filters: {
      branchId?: number;
      staffTypeId?: number;
      state?: string;
      search?: string;
    }): Promise<StaffCurrentLocation[]> {
      const { data } = await http.get<StaffCurrentLocation[]>(endpoints.STAFF_LOCATIONS_LATEST, {
        params: filters,
      });
      return data;
    },

    async reportMyLocation(request: ReportStaffLocation): Promise<ReportStaffLocationResult> {
      const { data } = await http.post<ReportStaffLocationResult>(endpoints.STAFF_LOCATION_REPORT_MINE, request);
      return data;
    },
  };
}
