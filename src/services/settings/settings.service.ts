import { companySettingsModule } from "@/app/composition/company-settings";
import type { CompanySettings } from "@/features/company-settings/domain/company-settings";

/** @deprecated Prefer the company-settings module from the app composition root. */
export const SettingsService = {
  getSettings: companySettingsModule.getSettings,
  updateSettings: async (payload: CompanySettings | null) => {
    if (!payload) throw new Error("La configuración de empresa es obligatoria.");
    return companySettingsModule.saveSettings(payload);
  },
};
