import { useQuery } from "@tanstack/react-query";
import type { CityCatalogItem, DepartmentCatalogItem } from "@/services/geography/geography.service";
import type { ClientQueries } from "../types";

type GeographyQueries = Pick<ClientQueries, "getDepartments" | "getCities">;

export function useClientGeography(
  departmentId: number | null | undefined,
  geography: GeographyQueries,
) {
  const departmentsQuery = useQuery<DepartmentCatalogItem[]>({
    queryKey: ["geography", "departments"],
    queryFn: geography.getDepartments,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const citiesQuery = useQuery<CityCatalogItem[]>({
    queryKey: ["geography", "cities", departmentId],
    queryFn: () => geography.getCities(departmentId!),
    enabled: departmentId != null,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return {
    departments: departmentsQuery.data ?? [],
    departmentsLoading: departmentsQuery.isLoading,
    cities: departmentId == null ? [] : citiesQuery.data ?? [],
    citiesLoading: departmentId != null && citiesQuery.isLoading,
  };
}
