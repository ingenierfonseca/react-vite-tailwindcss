import type { Client } from "../domain/client";
import type { useClientLabels } from "@/shared/hooks/useClientLabels";
import type { CustomerDashboard, CustomerRiskDashboard } from "@/services/customer/customer.type";
import type { ClinicalSession } from "@/services/clinical-session/clinicalSession.type";
import type { SessionPlan } from "@/services/treatment-plan/treatmentPlan.type";
import type { CityCatalogItem, DepartmentCatalogItem } from "@/services/geography/geography.service";

export type ClientLabels = ReturnType<typeof useClientLabels>;

export interface ClientProfileData {
  risks: CustomerRiskDashboard[];
  treatmentHistory: SessionPlan[];
  consultationHistory: ClinicalSession[];
  error?: string;
}

export interface ClientQueries {
  getDashboard: () => Promise<CustomerDashboard[]>;
  getProfile: (clientId: number) => Promise<ClientProfileData>;
  getDepartments: () => Promise<DepartmentCatalogItem[]>;
  getCities: (departmentId: number) => Promise<CityCatalogItem[]>;
}

export interface ClientFormRenderProps<TClient extends Client> {
  client: TClient;
  labels: ClientLabels;
  saving: boolean;
  canSave: boolean;
  error: string | null;
  onChange: (patch: Partial<TClient>) => void;
  onSubmit: (avatar: File | null) => Promise<void>;
  onCancel: () => void;
  geography: Pick<ClientQueries, "getDepartments" | "getCities">;
}

export interface ClientProfileActions {
  onClose: () => void;
  onEdit: () => void;
}
