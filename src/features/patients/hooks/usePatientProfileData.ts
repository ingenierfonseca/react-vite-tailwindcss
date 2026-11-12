import { useEffect, useState } from "react";
import type { CustomerRiskDashboard } from "../../../services/customer/customer.type";
import type { SessionPlan } from "../../../services/treatment-plan/treatmentPlan.type";
import type { ClinicalSession } from "../../../services/clinical-session/clinicalSession.type";

export interface PatientProfileData {
  risks: CustomerRiskDashboard[];
  treatmentHistory: SessionPlan[];
  consultationHistory: ClinicalSession[];
  error?: string;
}

export const usePatientProfileData = (
  patientId: number,
  getProfile: (id: number) => Promise<PatientProfileData>,
  enabled = true,
) => {
  const [result, setResult] = useState<{
    patientId: number;
    profile: PatientProfileData | null;
    error: string | null;
  } | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    getProfile(patientId)
      .then((data) => {
        if (active) setResult({ patientId, profile: data, error: data.error ?? null });
      })
      .catch((reason: unknown) => {
        if (active) {
          setResult({
            patientId,
            profile: null,
            error: reason instanceof Error ? reason.message : "No se pudo cargar el perfil.",
          });
        }
      });

    return () => { active = false; };
  }, [patientId, enabled, getProfile]);

  return {
    risks: enabled && result?.patientId === patientId ? result.profile?.risks ?? [] : [],
    treatmentHistory: enabled && result?.patientId === patientId ? result.profile?.treatmentHistory ?? [] : [],
    consultationHistory: enabled && result?.patientId === patientId ? result.profile?.consultationHistory ?? [] : [],
    loading: enabled && result?.patientId !== patientId,
    error: result?.patientId === patientId ? result.error : null,
  };
};