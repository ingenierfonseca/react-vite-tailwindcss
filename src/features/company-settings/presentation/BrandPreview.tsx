import { BriefcaseBusiness } from "lucide-react";
import type { CompanySettings } from "../domain/company-settings";

export function BrandPreview({ settings }: { settings: CompanySettings }) {
  const { company, branding } = settings;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <header className="border-b border-slate-200 px-5 py-4 dark:border-slate-700">
        <h2 className="font-semibold text-slate-900 dark:text-white">Vista previa</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Así se verá la identidad visual en la aplicación.</p>
      </header>
      <div className="grid min-h-64 sm:grid-cols-[180px_1fr]">
        <aside className="p-4 text-sm" style={{ backgroundColor: branding.sidebarBackground, color: branding.sidebarText }}>
          <div className="mb-5 flex items-center gap-2 truncate font-semibold">
            {branding.logoUrl ? (
              <span className="flex h-10 w-20 shrink-0 items-center justify-center rounded-md p-1" style={{ backgroundColor: branding.logoBackgroundColor }}>
                <img key={branding.logoUrl} src={branding.logoUrl} alt="" className="max-h-full max-w-full rounded-md object-contain" />
              </span>
            ) : (
              <span className="flex h-10 w-20 shrink-0 items-center justify-center rounded-md" style={{ backgroundColor: branding.logoBackgroundColor }}>
                <BriefcaseBusiness className="size-4" />
              </span>
            )}
            <span className="truncate" style={{ color: branding.companyNameColor }}>{company.name || "Nombre de empresa"}</span>
          </div>
          <div className="mb-4 flex gap-2 text-xs">
            <span className="rounded px-2 py-1" style={{ backgroundColor: "#ffffff", color: branding.companyNameColor }}>Nombre claro</span>
            <span className="rounded px-2 py-1" style={{ backgroundColor: "#0f172a", color: branding.companyNameColorDark }}>Nombre oscuro</span>
          </div>
          <div className="rounded-lg px-3 py-2 font-medium" style={{ backgroundColor: branding.sidebarItemBackground, color: branding.sidebarActiveText }}>
            Personalizar
          </div>
          <div className="mt-2 rounded-lg px-3 py-2">Menú de ejemplo</div>
        </aside>
        <div className="space-y-4 p-5">
          <div>
            <p className="text-xs text-slate-500">Panel de administración</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">{company.name || "Nombre de empresa"}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{ backgroundColor: branding.primaryColor }}>
              Acción principal
            </button>
            <button type="button" className="rounded-lg border px-4 py-2 text-sm" style={{ borderColor: branding.borderColor, color: branding.primaryColor }}>
              Acción secundaria
            </button>
            <span className="rounded-lg px-3 py-2 text-sm font-medium" style={{ backgroundColor: branding.secondaryColor, color: "#1f2937" }}>
              Acento
            </span>
          </div>
          <div className="rounded-lg border p-3 text-sm text-slate-600 dark:text-slate-300" style={{ borderColor: branding.borderColor }}>
            Los cambios de color se previsualizan en esta pantalla antes de guardarse.
          </div>
        </div>
      </div>
    </section>
  );
}
