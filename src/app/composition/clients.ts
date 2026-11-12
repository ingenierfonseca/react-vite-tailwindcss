import type { Client } from "@/features/clients";
import { createClientModule } from "@/features/clients/application/create-client-module";
import { customerRepository } from "@/services/customer/customer.repository";
import { CustomerService } from "@/services/customer/customer.service";
import { SessionPlanService } from "@/services/session-plan/sessionPlan.service";
import { ClinicalSessionService } from "@/services/clinical-session/clinicalSession.service";
import { GeographyService } from "@/services/geography/geography.service";

export const customerClientModule = createClientModule<Client>(customerRepository);

/** App-specific reads composed for the clients presentation layer. */
export const customerClientQueries = {
  getDashboard: CustomerService.getDashboard,
  getDepartments: GeographyService.getDepartments,
  getCities: GeographyService.getCities,
  getProfile: async (clientId: number) => {
    const results = await Promise.allSettled([
      CustomerService.getCustomerRisk(clientId),
      SessionPlanService.getTreatmentHistory(clientId),
      ClinicalSessionService.getSessionHistory(clientId),
    ]);

    const [risks, treatmentHistory, consultationHistory] = results;
    const errors = results
      .filter((result) => result.status === "rejected")
      .map((result) => result.reason instanceof Error
        ? result.reason.message
        : "No se pudo cargar toda la información del perfil.");

    return {
      risks: risks.status === "fulfilled" ? risks.value : [],
      treatmentHistory: treatmentHistory.status === "fulfilled" ? treatmentHistory.value : [],
      consultationHistory: consultationHistory.status === "fulfilled" ? consultationHistory.value : [],
      error: errors.length ? errors.join(" ") : undefined,
    };
  },
};
