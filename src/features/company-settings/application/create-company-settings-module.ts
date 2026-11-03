import type { CompanySettings } from "../domain/company-settings";
import { validateCompanySettings } from "../domain/company-settings";
import type { CompanySettingsRepository } from "../domain/company-settings.repository";

export function createCompanySettingsModule(repository: CompanySettingsRepository) {
  return {
    getSettings: () => repository.get(),

    async saveSettings(settings: CompanySettings, logoFile?: File) {
      const validationError = validateCompanySettings(settings);
      if (validationError) throw new Error(validationError);

      let settingsToSave = settings;
      if (logoFile) {
        if (!/^image\/(?:png|jpeg|webp)$/.test(logoFile.type)) {
          throw new Error("El logo debe ser PNG, JPEG o WebP.");
        }
        if (logoFile.size > 2 * 1024 * 1024) {
          throw new Error("El logo optimizado no puede superar 2 MB.");
        }
        const logoUrl = await repository.uploadLogo(logoFile);
        settingsToSave = {
          ...settings,
          branding: { ...settings.branding, logoUrl },
        };
        const uploadedSettingsError = validateCompanySettings(settingsToSave);
        if (uploadedSettingsError) throw new Error(uploadedSettingsError);
      }

      return repository.save(settingsToSave);
    },
  };
}

export type CompanySettingsModule = ReturnType<typeof createCompanySettingsModule>;
