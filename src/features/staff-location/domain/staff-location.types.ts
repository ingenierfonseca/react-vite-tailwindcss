export type ReportedLocationState = "Normal" | "Alert" | "PhoneOff";
export type LocationAvailability = "Online" | "Alert" | "Offline" | "PhoneOff" | "NeverReported";

export interface Branch {
  id: number;
  code: string;
  name: string;
  address?: string | null;
  city?: string | null;
  isActive: boolean;
  staffCount: number;
}

export interface CreateBranch {
  code: string;
  name: string;
  address?: string;
  city?: string;
}

export interface StaffAssignment {
  staffId: number;
  name: string;
  staffType: string;
  branchId?: number | null;
  branchName?: string | null;
  hasLogin: boolean;
}

export interface StaffCurrentLocation {
  userId: number;
  staffId: number;
  username: string;
  firstName: string;
  lastName: string;
  staffName: string;
  avatar?: string | null;
  staffType: string;
  branchId: number;
  branchName: string;
  latitude?: number | null;
  longitude?: number | null;
  accuracyMeters?: number | null;
  reportedState?: ReportedLocationState | null;
  availability: LocationAvailability;
  isStale: boolean;
  alertCode?: string | null;
  alertMessage?: string | null;
  deviceId?: string | null;
  capturedAtUtc?: string | null;
  lastReceivedAtUtc?: string | null;
  secondsSinceLastReport?: number | null;
}

export interface ReportStaffLocation {
  clientReadingId: string;
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  capturedAtUtc: string;
  state: ReportedLocationState;
  deviceId?: string;
  alertCode?: string;
  alertMessage?: string;
}

export interface ReportStaffLocationResult {
  historyId: number;
  duplicate: boolean;
  currentLocationUpdated: boolean;
  receivedAtUtc: string;
}
