import { api, ENDPOINTS } from "@/core/api";
import { createCompanySettingsModule } from "@/features/company-settings/application/create-company-settings-module";
import { createHttpCompanySettingsRepository } from "@/features/company-settings/infrastructure/http-company-settings.repository";

export const companySettingsModule = createCompanySettingsModule(
  createHttpCompanySettingsRepository(api, {
    get: ENDPOINTS.SETTINGS_CURRENT,
    save: ENDPOINTS.SETTINGS,
    uploadLogo: ENDPOINTS.SETTINGS_LOGO,
  }),
);
