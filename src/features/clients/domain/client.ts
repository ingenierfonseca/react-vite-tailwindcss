import type { useClientLabels } from "@/shared/hooks/useClientLabels";

export interface Client {
  id: number;
  idType: number
  dni: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  address?: string;
  avatar?: string;
  birthDate: string
  gender: string
  departmentId?: number | null
  departmentName?: string | null
  cityId?: number | null
  cityName?: string | null
  latitude?: number | null
  longitude?: number | null
  locationAccuracyMeters?: number | null
  locationSource?: "ManualMap" | "BrowserGps" | null
  locationUpdatedAtUtc?: string | null
  locationDataProvided?: boolean
}

export interface ClientQuery {
  page: number;
  search: string;
  size?: number;
}

export interface ClientPage<TClient> {
  data: TClient[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}

export type ClientLabels = ReturnType<typeof useClientLabels>;
