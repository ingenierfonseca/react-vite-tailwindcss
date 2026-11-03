import type { AxiosInstance } from "axios";
import type { CompanySettingsRepository } from "../domain/company-settings.repository";
import type { CompanySettings } from "../domain/company-settings";
import { fromCompanySettings, toCompanySettings, type CompanySettingsDto } from "./company-settings.dto";

export interface HttpCompanySettingsEndpoints {
  get: string;
  save: string;
  uploadLogo: string;
}

interface LogoUploadResponse {
  url?: string;
  logoUrl?: string;
}

export function createHttpCompanySettingsRepository(
  http: AxiosInstance,
  endpoints: HttpCompanySettingsEndpoints,
): CompanySettingsRepository {
  return {
    async get() {
      const { data } = await http.get<CompanySettingsDto>(endpoints.get, { timeout: 5_000 });
      return toCompanySettings(data ?? {});
    },

    async save(settings: CompanySettings) {
      const { data } = await http.put<CompanySettingsDto>(endpoints.save, fromCompanySettings(settings));
      return data && Object.keys(data).length > 0
        ? toCompanySettings({ ...fromCompanySettings(settings), ...data })
        : settings;
    },

    async uploadLogo(file) {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await http.post<LogoUploadResponse>(endpoints.uploadLogo, formData, {
        headers: { "Content-Type": undefined },
      });
      const logoUrl = data?.url ?? data?.logoUrl;
      if (!logoUrl) throw new Error("El servidor no devolvió la URL del logo.");
      return logoUrl;
    },
  };
}
