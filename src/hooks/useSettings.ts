import { createContext, useContext } from "react";
import type { CompanySettings } from "@/features/company-settings/domain/company-settings";

export interface SettingsContextValue {
  settings: CompanySettings;
  persistedSettings: CompanySettings;
  loading: boolean;
  saving: boolean;
  error: string | null;
  previewSettings: (settings: CompanySettings) => void;
  cancelPreview: () => void;
  saveSettings: (settings: CompanySettings, logoFile?: File) => Promise<CompanySettings>;
  reloadSettings: () => Promise<void>;
}

export const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings debe usarse dentro de SettingsProvider");
  return context;
}
