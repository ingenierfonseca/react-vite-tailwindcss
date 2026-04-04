import { useEffect, useState } from "react";
import { SettingsService } from "../services/settings/settings.service";

interface SettingsProviderProps {  
    children: React.ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await SettingsService.getSettings();
        
        if (data.primaryColor) {
          // Aplicamos el color a la variable de Tailwind v4
          document.documentElement.style.setProperty('--color-primary-dynamic', data.primaryColor);
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

  return <>{children}</>;
}