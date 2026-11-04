import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router";
import { CircleDollarSign, Pencil, Plus } from "lucide-react";
import { toast } from "react-toastify";
import PageComponent from "@/components/commons/PageComponent";
import Modal from "@/components/commons/Modal";
import { CurrencyService } from "@/services/currency/currency.service";
import type { Currency } from "@/models/currency.type";
import { usePermissions } from "@/hooks/usePermissions";
import { PermissionAction, PermissionResource } from "@/models/permission.enum";
import { creditModule } from "@/app/composition/credit";
import type { CreditProduct, SaveCreditProduct } from "../domain/credit.types";

const inputClass = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-950";

function emptyProduct(currencyId: number): SaveCreditProduct {
  return {
    code: "",
    name: "",
    description: "",
    currencyId,
    minimumAmount: 100,
    maximumAmount: 5000,
    annualRatePercent: 0,
    originationFeePercent: 0,
    originationFeeFixed: 0,
    minimumTermMonths: 1,
    maximumTermMonths: 12,
    defaultTermMonths: 6,
    installmentFrequencyMonths: 1,
    amortizationMethod: "FixedPayment",
    isActive: true,
  };
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block space-y-1 text-sm font-medium text-slate-700 dark:text-slate-200"><span>{label}</span>{children}</label>;
}

export default function CreditProductsPage() {
  const { can, isSuperAdmin } = usePermissions();
  const canView = isSuperAdmin || can(PermissionAction.View, PermissionResource.CreditProducts);
  const canCreate = isSuperAdmin || can(PermissionAction.Create, PermissionResource.CreditProducts);
  const canEdit = isSuperAdmin || can(PermissionAction.Update, PermissionResource.CreditProducts);
  const [products, setProducts] = useState<CreditProduct[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [draft, setDraft] = useState<SaveCreditProduct | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [productPage, currencyPage] = await Promise.all([
        creditModule.listProducts(1, 100, false),
        CurrencyService.get({ page: 1, size: 100, search: "" }),
      ]);
      setProducts(productPage.data);
      setCurrencies(currencyPage.data);
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "No se pudieron cargar los productos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const openCreate = () => {
    const currencyId = currencies[0]?.id ?? 1;
    setEditingId(null);
    setError(null);
    setDraft(emptyProduct(currencyId));
  };

  const openEdit = (product: CreditProduct) => {
    setEditingId(product.id);
    setError(null);
    setDraft({
      code: product.code,
      name: product.name,
      description: product.description ?? "",
      currencyId: product.currencyId,
      minimumAmount: product.minimumAmount,
      maximumAmount: product.maximumAmount,
      annualRatePercent: product.annualRatePercent,
      originationFeePercent: product.originationFeePercent,
      originationFeeFixed: product.originationFeeFixed,
      minimumTermMonths: product.minimumTermMonths,
      maximumTermMonths: product.maximumTermMonths,
      defaultTermMonths: product.defaultTermMonths,
      installmentFrequencyMonths: product.installmentFrequencyMonths,
      amortizationMethod: product.amortizationMethod === "EqualPrincipal" ? "EqualPrincipal" : "FixedPayment",
      isActive: product.isActive,
    });
  };

  const update = <K extends keyof SaveCreditProduct>(key: K, value: SaveCreditProduct[K]) => {
    setDraft((current) => current ? { ...current, [key]: value } : current);
  };

  const save = async () => {
    if (!draft) return;
    setSaving(true);
    setError(null);
    try {
      if (editingId) await creditModule.updateProduct(editingId, draft);
      else await creditModule.createProduct(draft);
      setDraft(null);
      await load();
      toast.success(editingId ? "Producto actualizado." : "Producto creado.");
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : "No se pudo guardar el producto.";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (!canView) return <Navigate to="/not-found" replace />;

  return (
    <PageComponent title="Productos de crédito" description="Define los montos, tasas, plazos y métodos de amortización." textButton="Nuevo producto" onclick={openCreate} showButton={canCreate}>
      {error && !draft && <div role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {loading ? <p className="py-8 text-center text-sm text-slate-500">Cargando productos…</p> : products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
          <CircleDollarSign className="mx-auto mb-3 size-8 text-primary" />
          <p className="font-semibold">Aún no hay productos de crédito</p>
          {canCreate && <button type="button" onClick={openCreate} className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"><Plus className="mr-2 inline size-4" />Crear primer producto</button>}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="hidden grid-cols-[1.2fr_1fr_1fr_1fr_1fr_auto] gap-3 border-b px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid">
            <span>Producto</span><span>Moneda</span><span>Monto</span><span>Tasa anual</span><span>Plazo</span><span>Estado</span>
          </div>
          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {products.map((product) => (
              <li key={product.id} className="grid gap-2 px-4 py-3 md:grid-cols-[1.2fr_1fr_1fr_1fr_1fr_auto] md:items-center md:gap-3">
                <div><p className="font-semibold">{product.name}</p><p className="text-xs text-slate-500">{product.code} · {product.amortizationMethod === "EqualPrincipal" ? "Capital constante" : "Cuota fija"}</p></div>
                <span className="text-sm">{product.currencyCode} ({product.currencySymbol})</span>
                <span className="text-sm">{product.currencySymbol}{product.minimumAmount.toLocaleString()} – {product.currencySymbol}{product.maximumAmount.toLocaleString()}</span>
                <span className="text-sm">{product.annualRatePercent.toFixed(2)}%</span>
                <span className="text-sm">{product.minimumTermMonths}–{product.maximumTermMonths} meses</span>
                <span className="flex items-center justify-between gap-2">
                  <span className={`rounded-full px-2 py-1 text-xs ${product.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{product.isActive ? "Activo" : "Inactivo"}</span>
                  {canEdit && <button type="button" onClick={() => openEdit(product)} aria-label={`Editar ${product.name}`} className="rounded-md p-2 text-primary hover:bg-primary/10"><Pencil className="size-4" /></button>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Modal isOpen={Boolean(draft)} onClose={() => setDraft(null)} title={editingId ? "Editar producto" : "Nuevo producto"} textBtnConfirm="Guardar" clickBtnConfirm={save} disabled={saving || (editingId ? !canEdit : !canCreate)}>
        {draft && (
          <div className="grid max-h-[65vh] gap-4 overflow-y-auto p-1 sm:grid-cols-2">
            <Field label="Código"><input className={inputClass} maxLength={30} value={draft.code} disabled={saving} onChange={(event) => update("code", event.target.value.toUpperCase())} /></Field>
            <Field label="Nombre"><input className={inputClass} maxLength={120} value={draft.name} disabled={saving} onChange={(event) => update("name", event.target.value)} /></Field>
            <Field label="Moneda"><select className={inputClass} value={draft.currencyId} disabled={saving} onChange={(event) => update("currencyId", Number(event.target.value))}>{currencies.map((currency) => <option key={currency.id} value={currency.id}>{currency.code} — {currency.name}</option>)}</select></Field>
            <Field label="Método de amortización"><select className={inputClass} value={draft.amortizationMethod} disabled={saving} onChange={(event) => update("amortizationMethod", event.target.value as SaveCreditProduct["amortizationMethod"])}><option value="FixedPayment">Cuota fija (francés)</option><option value="EqualPrincipal">Capital constante (alemán)</option></select></Field>
            <Field label="Monto mínimo"><input className={inputClass} type="number" min="0.01" step="0.01" value={draft.minimumAmount} disabled={saving} onChange={(event) => update("minimumAmount", Number(event.target.value))} /></Field>
            <Field label="Monto máximo"><input className={inputClass} type="number" min="0.01" step="0.01" value={draft.maximumAmount} disabled={saving} onChange={(event) => update("maximumAmount", Number(event.target.value))} /></Field>
            <Field label="Tasa nominal anual (%)"><input className={inputClass} type="number" min="0" step="0.01" value={draft.annualRatePercent} disabled={saving} onChange={(event) => update("annualRatePercent", Number(event.target.value))} /></Field>
            <Field label="Comisión de apertura (%)"><input className={inputClass} type="number" min="0" step="0.01" value={draft.originationFeePercent} disabled={saving} onChange={(event) => update("originationFeePercent", Number(event.target.value))} /></Field>
            <Field label="Comisión fija de apertura"><input className={inputClass} type="number" min="0" step="0.01" value={draft.originationFeeFixed} disabled={saving} onChange={(event) => update("originationFeeFixed", Number(event.target.value))} /></Field>
            <Field label="Plazo mínimo (meses)"><input className={inputClass} type="number" min="1" value={draft.minimumTermMonths} disabled={saving} onChange={(event) => update("minimumTermMonths", Number(event.target.value))} /></Field>
            <Field label="Plazo máximo (meses)"><input className={inputClass} type="number" min="1" value={draft.maximumTermMonths} disabled={saving} onChange={(event) => update("maximumTermMonths", Number(event.target.value))} /></Field>
            <Field label="Plazo sugerido (meses)"><input className={inputClass} type="number" min="1" value={draft.defaultTermMonths} disabled={saving} onChange={(event) => update("defaultTermMonths", Number(event.target.value))} /></Field>
            <Field label="Frecuencia de cuotas (meses)"><input className={inputClass} type="number" min="1" value={draft.installmentFrequencyMonths} disabled={saving} onChange={(event) => update("installmentFrequencyMonths", Number(event.target.value))} /></Field>
            <label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" checked={draft.isActive} disabled={saving} onChange={(event) => update("isActive", event.target.checked)} /> Producto activo para nuevas solicitudes</label>
            <Field label="Descripción"><textarea className={`${inputClass} min-h-20`} maxLength={500} value={draft.description ?? ""} disabled={saving} onChange={(event) => update("description", event.target.value)} /></Field>
            {error && <p role="alert" className="text-sm text-red-600 sm:col-span-2">{error}</p>}
          </div>
        )}
      </Modal>
    </PageComponent>
  );
}
