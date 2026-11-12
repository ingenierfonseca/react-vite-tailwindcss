import { useContext } from "react";
import { LanguageContext } from "./language-context";

export function useAppLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useAppLanguage debe usarse dentro de LanguageProvider");
  return context;
}
