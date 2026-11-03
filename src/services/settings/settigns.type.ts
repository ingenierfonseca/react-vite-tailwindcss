import { createDefaultCompanySettings } from "@/features/company-settings/domain/company-settings";

/** @deprecated Import CompanySettings from the company-settings feature. */
export type { CompanySettings as Settings } from "@/features/company-settings/domain/company-settings";

/** Kept as a compatibility helper for older settings consumers. */
export function data() {
  return createDefaultCompanySettings();
}
