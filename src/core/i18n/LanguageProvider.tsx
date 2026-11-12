import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/es";
import "dayjs/locale/en";
import { TerminologyProvider } from "@/provider/TerminologyProvider";
import i18n from "./index";
import {
  LANGUAGE_SETTINGS,
  LANGUAGE_STORAGE_KEY,
  LanguageContext,
  type AppLanguage,
} from "./language-context";
import { useAppLanguage } from "./useAppLanguage";

function getInitialLanguage(): AppLanguage {
  try {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY) === "en" ? "en" : "es";
  } catch {
    return "es";
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>(getInitialLanguage);

  const setLanguage = useCallback((nextLanguage: AppLanguage) => {
    setLanguageState(nextLanguage);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    } catch {
      // The selected language still applies for this session when storage is unavailable.
    }
  }, []);

  useEffect(() => {
    const settings = LANGUAGE_SETTINGS[language];
    document.documentElement.lang = settings.htmlLang;
    void i18n.changeLanguage(language);
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage }), [language, setLanguage]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

/** Bridges the selected UI language into MUI and the terminology API provider. */
export function LanguageRuntimeProvider({ children }: { children: ReactNode }) {
  const { language } = useAppLanguage();
  const settings = LANGUAGE_SETTINGS[language];

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale={settings.datePickerLocale}
    >
      <TerminologyProvider languageCode={settings.terminologyCode}>
        {children}
      </TerminologyProvider>
    </LocalizationProvider>
  );
}
