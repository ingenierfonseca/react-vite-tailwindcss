import { createContext } from "react";

export type AppLanguage = "es" | "en";

export const LANGUAGE_STORAGE_KEY = "app-language";

export const LANGUAGE_SETTINGS: Record<AppLanguage, {
  terminologyCode: string;
  datePickerLocale: string;
  htmlLang: string;
}> = {
  es: { terminologyCode: "es-NI", datePickerLocale: "es", htmlLang: "es" },
  en: { terminologyCode: "en-US", datePickerLocale: "en", htmlLang: "en" },
};

export interface LanguageContextValue {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);
