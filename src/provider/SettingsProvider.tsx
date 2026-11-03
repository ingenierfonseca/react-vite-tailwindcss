import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { companySettingsModule } from "@/app/composition/company-settings";
import { createDefaultCompanySettings, type CompanySettings } from "@/features/company-settings/domain/company-settings";
import { SettingsContext } from "@/hooks/useSettings";

interface SettingsProviderProps {
  children: ReactNode;
}

function messageFromError(error: unknown) {
  return error instanceof Error ? error.message : "Ocurrió un error al cargar la configuración.";
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<CompanySettings>(createDefaultCompanySettings);
  const [persistedSettings, setPersistedSettings] = useState<CompanySettings>(createDefaultCompanySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const persistedSettingsRef = useRef(persistedSettings);

  const reloadSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const loaded = await companySettingsModule.getSettings();
      persistedSettingsRef.current = loaded;
      setSettings(loaded);
      setPersistedSettings(loaded);
    } catch (loadError) {
      const defaults = createDefaultCompanySettings();
      persistedSettingsRef.current = defaults;
      setSettings(defaults);
      setPersistedSettings(defaults);
      setError(messageFromError(loadError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reloadSettings();
  }, [reloadSettings]);

  useLayoutEffect(() => {
    const { branding } = settings;
    const root = document.documentElement;
    const variables: Record<string, string> = {
      "--color-primary-dynamic": branding.primaryColor,
      "--color-primary-dark-dynamic": branding.primaryDarkColor,
      "--color-secondary-dynamic": branding.secondaryColor,
      "--color-border-dynamic": branding.borderColor,
      "--color-border-hover-dynamic": branding.borderHover,
      "--color-sidebar-dynamic": branding.sidebarBackground,
      "--color-sidebar-item-dynamic": branding.sidebarItemBackground,
      "--color-sidebar-text-dynamic": branding.sidebarText,
      "--color-sidebar-text-active-dynamic": branding.sidebarActiveText,
      "--color-company-name-dynamic": branding.companyNameColor,
      "--color-company-name-dark-dynamic": branding.companyNameColorDark,
      "--color-company-logo-background-dynamic": branding.logoBackgroundColor,
    };
    Object.entries(variables).forEach(([name, value]) => root.style.setProperty(name, value));

    let favicon = document.querySelector<HTMLLinkElement>('link[rel~="icon"]');
    if (branding.faviconUrl) {
      if (!favicon) {
        favicon = document.createElement("link");
        favicon.rel = "icon";
        document.head.appendChild(favicon);
      }
      favicon.href = branding.faviconUrl;
    } else {
      favicon?.remove();
    }
  }, [settings]);

  const previewSettings = useCallback((nextSettings: CompanySettings) => {
    setSettings(nextSettings);
  }, []);

  const cancelPreview = useCallback(() => {
    setSettings(persistedSettingsRef.current);
    setError(null);
  }, []);

  const saveSettings = useCallback(async (nextSettings: CompanySettings, logoFile?: File) => {
    setSaving(true);
    setError(null);
    try {
      const saved = await companySettingsModule.saveSettings(nextSettings, logoFile);
      persistedSettingsRef.current = saved;
      setSettings(saved);
      setPersistedSettings(saved);
      return saved;
    } catch (saveError) {
      setError(messageFromError(saveError));
      throw saveError;
    } finally {
      setSaving(false);
    }
  }, []);

  const value = useMemo(() => ({
    settings,
    persistedSettings,
    loading,
    saving,
    error,
    previewSettings,
    cancelPreview,
    saveSettings,
    reloadSettings,
  }), [settings, persistedSettings, loading, saving, error, previewSettings, cancelPreview, saveSettings, reloadSettings]);

  if (loading) return <div className="h-screen bg-[#1a2234]" />;

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}
