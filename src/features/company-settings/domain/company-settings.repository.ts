import type { CompanySettings } from "./company-settings";

export interface CompanySettingsRepository {
  get(): Promise<CompanySettings>;
  save(settings: CompanySettings): Promise<CompanySettings>;
  uploadLogo(file: File): Promise<string>;
}
