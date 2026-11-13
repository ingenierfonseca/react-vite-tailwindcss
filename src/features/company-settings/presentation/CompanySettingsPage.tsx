import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Building2, Image, Link, Palette, Upload } from "lucide-react";
import { Navigate } from "react-router";
import { toast } from "react-toastify";
import PageComponent from "@/components/commons/PageComponent";
import TextFieldApp from "@/components/commons/TextFieldApp";
import { ButtonApp, CancelButtonApp, SubmitSaveApp } from "@/components/commons/ButtonSaveApp";
import { usePermissions } from "@/hooks/usePermissions";
import { useSettings } from "@/hooks/useSettings";
import { PermissionAction, PermissionResource } from "@/models/permission.enum";
import { validateCompanySettings, type BrandTheme, type CompanySettings } from "../domain/company-settings";
import { BrandPreview } from "./BrandPreview";
import { prepareLogoFile, type PreparedLogo } from "./prepare-logo-file";
import { BasicStepComponent } from "@/features/upload-data/components/StepComponent";

interface LogoSelection extends PreparedLogo {
  previewUrl: string;
}

function ColorField({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}) {
  const validHex = /^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(value);
  return (
    <div className="flex flex-col gap-1 rounded-xl p-3 dark:border-slate-700">
      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">{label}</label>
      <div className="flex gap-3">
        <input
          type="color"
          aria-label={label}
          value={validHex ? value : "#000000"}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className="h-8 cursor-pointer rounded-lg border-0 bg-transparent p-0 disabled:cursor-not-allowed"
        />
        <div className="min-w-0 flex-1">
          <input
            type="text"
            value={value}
            maxLength={7}
            disabled={disabled}
            onChange={(event) => onChange(event.target.value)}
            className="w-full rounded-md border border-slate-200 bg-transparent px-2 py-1.5 text-sm uppercase outline-none focus:border-primary dark:border-slate-700"
          />
        </div>
      </div>
    </div>
  );
}

export default function CompanySettingsPage() {
  const { can, isSuperAdmin } = usePermissions();
  const {
    settings,
    persistedSettings,
    saving,
    error,
    previewSettings,
    cancelPreview,
    saveSettings,
  } = useSettings();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<CompanySettings>(settings);
  const [logoMode, setLogoMode] = useState<"url" | "file">("url");
  const [logoSelection, setLogoSelection] = useState<LogoSelection | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const canView = isSuperAdmin || can(PermissionAction.View, PermissionResource.CompanySettings);
  const canEdit = isSuperAdmin || can(PermissionAction.Update, PermissionResource.CompanySettings);
  const validationError = validateCompanySettings(draft);

  useEffect(() => () => cancelPreview(), [cancelPreview]);
  useEffect(() => {
    if (!logoSelection) return;
    return () => URL.revokeObjectURL(logoSelection.previewUrl);
  }, [logoSelection]);

  const previewDraft = (next: CompanySettings, logoOverride = logoSelection?.previewUrl) => {
    if (validateCompanySettings(next)) return;
    previewSettings(logoOverride
      ? { ...next, branding: { ...next.branding, logoUrl: logoOverride } }
      : next);
  };

  const previewLogoOnly = (logoUrl: string) => {
    previewSettings({ ...settings, branding: { ...settings.branding, logoUrl } });
  };

  const updateCompany = (patch: Partial<CompanySettings["company"]>) => {
    const next = { ...draft, company: { ...draft.company, ...patch } };
    setDraft(next);
    if (!validateCompanySettings(next)) previewDraft(next);
  };

  const updateBrand = (patch: Partial<BrandTheme>) => {
    const next = { ...draft, branding: { ...draft.branding, ...patch } };
    setDraft(next);
    if (!validateCompanySettings(next)) previewDraft(next);
  };

  const handleLogoFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setLogoError(null);
    try {
      const prepared = await prepareLogoFile(file);
      const previewUrl = URL.createObjectURL(prepared.file);
      const next = { ...draft, branding: { ...draft.branding, logoUrl: "" } };
      setDraft(next);
      setLogoMode("file");
      setLogoSelection({ ...prepared, previewUrl });
      previewLogoOnly(previewUrl);
    } catch (fileError) {
      setLogoSelection(null);
      previewLogoOnly(draft.branding.logoUrl);
      const message = fileError instanceof Error ? fileError.message : "No se pudo procesar el logo.";
      setLogoError(message);
      toast.error(message);
    }
  };

  const clearLogo = () => {
    setLogoSelection(null);
    setLogoError(null);
    const next = { ...draft, branding: { ...draft.branding, logoUrl: "" } };
    setDraft(next);
    previewLogoOnly("");
  };

  const changeLogoUrl = (logoUrl: string) => {
    setLogoSelection(null);
    setLogoMode("url");
    setLogoError(null);
    const next = { ...draft, branding: { ...draft.branding, logoUrl } };
    setDraft(next);
    if (!validateCompanySettings(next)) previewDraft(next, logoUrl);
    else previewLogoOnly("");
  };

  const discardChanges = () => {
    setDraft(persistedSettings);
    setLogoSelection(null);
    setLogoMode("url");
    setLogoError(null);
    cancelPreview();
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validationError) {
      toast.error(validationError);
      return;
    }
    try {
      const saved = await saveSettings(draft, logoSelection?.file);
      setDraft(saved);
      setLogoSelection(null);
      setLogoMode("url");
      setLogoError(null);
      toast.success("Configuración de empresa guardada.");
    } catch (saveError) {
      toast.error(saveError instanceof Error ? saveError.message : "No se pudo guardar la configuración.");
    }
  };

  if (!canView) return <Navigate to="/not-found" replace />;

  return (
    <PageComponent title="Personalizar empresa" description="Administra los datos de la empresa y la identidad visual de la aplicación." textButton="" onclick={() => { }} showButton={false}>
      <form onSubmit={handleSave} className="space-y-5">
        {error && (
          <div role="alert" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
            {error}
          </div>
        )}

        <div className="flex py-3 justify-evenly">
          <BasicStepComponent stepActive={step} stepNumber={1} title="Datos de la empresa" onClick={() => setStep(1)} />
          <BasicStepComponent stepActive={step} stepNumber={2} title="Paleta de colores" onClick={() => setStep(2)} />
        </div>
        <div hidden={step !== 1} className="grid gap-5 xl:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5 flex items-start gap-3">
              <span className="rounded-xl bg-primary/10 p-2 text-primary"><Building2 className="size-5" /></span>
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-white">Datos de la empresa</h2>
                <p className="mt-1 text-sm text-slate-500">Información de contacto y datos comerciales.</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextFieldApp label="Nombre visible" value={draft.company.name} maxLength={100} disabled={!canEdit} onChange={(name) => updateCompany({ name })} />
              <TextFieldApp label="Razón social" value={draft.company.legalName} maxLength={150} disabled={!canEdit} onChange={(legalName) => updateCompany({ legalName })} />
              <TextFieldApp label="Identificación fiscal" value={draft.company.taxId} maxLength={40} disabled={!canEdit} onChange={(taxId) => updateCompany({ taxId })} />
              <TextFieldApp label="Teléfono" value={draft.company.phone} maxLength={40} disabled={!canEdit} onChange={(phone) => updateCompany({ phone })} />
              <TextFieldApp label="Correo electrónico" value={draft.company.email} maxLength={120} disabled={!canEdit} onChange={(email) => updateCompany({ email })} />
              <TextFieldApp label="Dirección" value={draft.company.address} maxLength={240} disabled={!canEdit} onChange={(address) => updateCompany({ address })} />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5 flex items-start gap-3">
              <span className="rounded-xl bg-primary/10 p-2 text-primary"><Image className="size-5" /></span>
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-white">Marca de la empresa</h2>
                <p className="mt-1 text-sm text-slate-500">Configura las imágenes que identifican la aplicación.</p>
              </div>
            </div>
            {(logoSelection?.previewUrl || draft.branding.logoUrl) && (
              <div className="mb-4 flex h-24 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950">
                <div className="flex h-10 w-20 items-center justify-center rounded-md p-1" style={{ backgroundColor: draft.branding.logoBackgroundColor }}>
                  <img key={logoSelection?.previewUrl ?? draft.branding.logoUrl} src={logoSelection?.previewUrl ?? draft.branding.logoUrl} alt={`Logo de ${draft.company.name}`} className="max-h-full max-w-full object-contain" onError={(event) => { event.currentTarget.style.visibility = "hidden"; }} />
                </div>
              </div>
            )}
            <div>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Origen del logo">
                <button type="button" disabled={!canEdit} onClick={() => { setLogoMode("url"); setLogoSelection(null); setLogoError(null); previewLogoOnly(draft.branding.logoUrl); }} className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${logoMode === "url" ? "border-primary bg-primary/10 text-primary" : "border-slate-300 dark:border-slate-700"}`}>
                  <Link className="size-4" /> Usar URL
                </button>
                <button type="button" disabled={!canEdit} onClick={() => { setLogoMode("file"); setLogoError(null); }} className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${logoMode === "file" ? "border-primary bg-primary/10 text-primary" : "border-slate-300 dark:border-slate-700"}`}>
                  <Upload className="size-4" /> Subir archivo
                </button>
              </div>
              <div className="mt-5">
                {logoMode === "url" ? (
                  <TextFieldApp label="URL del logo" value={draft.branding.logoUrl} maxLength={500} disabled={!canEdit} onChange={changeLogoUrl} />
                ) : (
                  <div className="space-y-2">
                    <label htmlFor="company-logo-file" className="block text-sm font-medium text-slate-700 dark:text-slate-200">Archivo del logo</label>
                    <input
                      id="company-logo-file"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      disabled={!canEdit || saving}
                      onChange={handleLogoFile}
                      className="block w-full rounded-lg border border-slate-300 bg-white p-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:font-medium file:text-primary dark:border-slate-700 dark:bg-slate-950"
                    />
                    <p className="text-xs text-slate-500">PNG, JPEG o WebP. Máximo 8 MB de origen. Se ajusta sin deformar a 2048 × 1024 px y se optimiza a un máximo de 2 MB. En el menú se muestra en un área de hasta 80 × 40 px.</p>
                    {logoSelection && <p className="text-xs text-slate-500">{logoSelection.file.name} · {logoSelection.width} × {logoSelection.height} px · {(logoSelection.file.size / (1024 * 1024)).toFixed(2)} MB</p>}
                    {logoError && <p role="alert" className="text-sm text-red-600">{logoError}</p>}
                    {(logoSelection || draft.branding.logoUrl) && <button type="button" disabled={!canEdit || saving} onClick={clearLogo} className="text-sm font-medium text-red-600 hover:underline">Quitar logo</button>}
                  </div>
                )}
              </div>
              <div className="mt-7 border-t border-slate-200 pt-5 dark:border-slate-700">
                <TextFieldApp label="URL del favicon" value={draft.branding.faviconUrl} maxLength={500} disabled={!canEdit} onChange={(faviconUrl) => updateBrand({ faviconUrl })} />
                <p className="mt-2 text-xs text-slate-500">El archivo del logo se sube al servidor y este debe devolver una URL permanente. El favicon se mantiene como URL.</p>
              </div>
            </div>
          </section>
        </div>

        <div hidden={step !== 2} className="flex flex-col gap-4">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5 flex items-start gap-3">
              <span className="rounded-xl bg-primary/10 p-2 text-primary"><Palette className="size-5" /></span>
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-white">Colores de la aplicación</h2>
                <p className="text-sm text-slate-500">Los cambios válidos se previsualizan inmediatamente y solo se guardan al confirmar.</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <ColorField label="Color principal" value={draft.branding.primaryColor} disabled={!canEdit} onChange={(primaryColor) => updateBrand({ primaryColor })} />
              <ColorField label="Color principal oscuro" value={draft.branding.primaryDarkColor} disabled={!canEdit} onChange={(primaryDarkColor) => updateBrand({ primaryDarkColor })} />
              <ColorField label="Color secundario" value={draft.branding.secondaryColor} disabled={!canEdit} onChange={(secondaryColor) => updateBrand({ secondaryColor })} />
              <ColorField label="Bordes" value={draft.branding.borderColor} disabled={!canEdit} onChange={(borderColor) => updateBrand({ borderColor })} />
              <ColorField label="Bordes al pasar el cursor" value={draft.branding.borderHover} disabled={!canEdit} onChange={(borderHover) => updateBrand({ borderHover })} />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5 flex items-start gap-3">
              <span className="rounded-xl bg-primary/10 p-2 text-primary"><Palette className="size-5" /></span>
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-white">Colores del sidebar(Menú izquierdo)</h2>
                <p className="text-sm text-slate-500">Los cambios válidos se previsualizan inmediatamente y solo se guardan al confirmar.</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <ColorField label="Fondo del menú" value={draft.branding.sidebarBackground} disabled={!canEdit} onChange={(sidebarBackground) => updateBrand({ sidebarBackground })} />
              <ColorField label="Elemento activo del menú" value={draft.branding.sidebarItemBackground} disabled={!canEdit} onChange={(sidebarItemBackground) => updateBrand({ sidebarItemBackground })} />
              <ColorField label="Texto del menú" value={draft.branding.sidebarText} disabled={!canEdit} onChange={(sidebarText) => updateBrand({ sidebarText })} />
              <ColorField label="Texto activo del menú" value={draft.branding.sidebarActiveText} disabled={!canEdit} onChange={(sidebarActiveText) => updateBrand({ sidebarActiveText })} />
              <ColorField label="Nombre de empresa (claro)" value={draft.branding.companyNameColor} disabled={!canEdit} onChange={(companyNameColor) => updateBrand({ companyNameColor })} />
              <ColorField label="Nombre de empresa (oscuro)" value={draft.branding.companyNameColorDark} disabled={!canEdit} onChange={(companyNameColorDark) => updateBrand({ companyNameColorDark })} />
              <ColorField label="Fondo detrás del logo" value={draft.branding.logoBackgroundColor} disabled={!canEdit} onChange={(logoBackgroundColor) => updateBrand({ logoBackgroundColor })} />
            </div>
          </section>

          <BrandPreview settings={logoSelection ? { ...draft, branding: { ...draft.branding, logoUrl: logoSelection.previewUrl } } : draft} />
        </div>

        {canEdit && (
          <div className="flex flex-wrap justify-end gap-3">
            <CancelButtonApp
              loading={false}
              label="Descartar cambios"
              disabled={saving}
              onClick={discardChanges} />
            <ButtonApp
              label="Siguiente"
              loading={saving}
              disabled={saving || Boolean(validationError)}
              onClick={() => setStep(step + 1)} />
            <SubmitSaveApp label="configuración" loading={saving} disabled={saving || Boolean(validationError)} />
          </div>
        )}
        {validationError && <p role="alert" className="text-right text-sm text-red-600">{validationError}</p>}
      </form>
    </PageComponent>
  );
}
