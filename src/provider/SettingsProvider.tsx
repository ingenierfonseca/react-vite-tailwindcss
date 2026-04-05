import { useEffect, useState } from "react";
import { SettingsService } from "../services/settings/settings.service";
import { SettingsContext } from "../hooks/useSettings";
import type { Settings } from "../services/settings/settigns.type";

interface SettingsProviderProps {  
    children: React.ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await SettingsService.getSettings();
        setSettings(data);
        
        if (data.primaryColor) {
          // Aplicamos el color a la variable de Tailwind v4
          document.documentElement.style.setProperty('--color-primary-dynamic', data.primaryColor);
          document.documentElement.style.setProperty('--color-border-dynamic', data.borderColor);
        }
      } catch (error) {
        console.error("Error cargando configuración", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Mientras carga el naranja real, puedes mostrar un spinner 
  // o dejar que use el naranja por defecto que pusimos en el CSS
  if (loading) return <div className="h-screen bg-[#1a2234]" />; 

  //return <>{children}</>;
  return (
        <SettingsContext.Provider value={{ settings, setSettings, loading }}>
            {children}
        </SettingsContext.Provider>
    )
}