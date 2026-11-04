import { useCallback, useEffect, useState } from "react";
import { Navigate } from "react-router";
import { BadgeCheck, Ban, FilePlus2 } from "lucide-react";
import { toast } from "react-toastify";
import PageComponent from "@/components/commons/PageComponent";
import Modal from "@/components/commons/Modal";
import TextFieldApp from "@/components/commons/TextFieldApp";
import { PaginatedAutocomplete } from "@/components/pagination-data/PaginatedAutocomplete";
import { CustomerService } from "@/services/customer/customer.service";
import { creditModule } from "@/app/composition/credit";
import { usePermissions } from "@/hooks/usePermissions";
import { PermissionAction, PermissionResource } from "@/models/permission.enum";
import type { CreditApplication, CreditDecision, CreditProduct, CreateCreditApplication } from "../domain/credit.types";

function emptyApplication(product?: CreditProduct): CreateCreditApplication {
  return {
    customerId: 0,
    creditProductId: product?.id ?? 0,
    requestedAmount: product?.minimumAmount ?? 0,
    requestedTermMonths: product?.defaultTermMonths ?? 1,
    purpose: "",
    monthlyIncome: 0,
    monthlyExpenses: 0,
    existingMonthlyDebt: 0,
    consentToDataProcessing: false,
    consentVersion: "credit-application-v1",
  };
}

export default function CreditApplicationsPage() {
  const { can, isSuperAdmin } = usePermissions();
  const canView = isSuperAdmin || can(PermissionAction.View, PermissionResource.CreditApplications);
  const canCreate = isSuperAdmin || can(PermissionAction.Create, PermissionResource.CreditApplications);
  const canDecide = isSuperAdmin || can(PermissionAction.Decide, PermissionResource.CreditApplications);
  const canDisburse = isSuperAdmin || can(PermissionAction.Disburse, PermissionResource.CreditLoans);
  const [applications, setApplications] = useState<CreditApplication[]>([]);
  const [products, setProducts] = useState<CreditProduct[]>([]);
  const [applicationDraft, setApplicationDraft] = useState<CreateCreditApplication | null>(null);
  const [decisionApplication, setDecisionApplication] = useState<CreditApplication | null>(null);
  const [decisionDraft, setDecisionDraft] = useState<CreditDecision>({ approved: true, reason: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [applicationPage, productPage] = await Promise.all([
        creditModule.listApplications(1, 100),
        creditModule.listProducts(1, 100, true),
      ]);
      setApplications(applicationPage.data);
      setProducts(productPage.data);
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "No se pudieron cargar las solicitudes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const openApplication = () => {
    const firstProduct = products[0];
    setApplicationDraft(emptyApplication(firstProduct));
    setError(null);
  };

  const changeProduct = (productId: number) => {
    const product = products.find((item) => item.id === productId);
    setApplicationDraft((current) => current ? {
      ...current,
      creditProductId: productId,
      requestedAmount: product?.minimumAmount ?? current.requestedAmount,
      requestedTermMonths: product?.defaultTermMonths ?? current.requestedTermMonths,
    } : current);
  };

  const createApplication = async () => {
    if (!applicationDraft) return;
    if (!applicationDraft.consentToDataProcessing) {
      setError("Debes registrar el consentimiento de tratamiento de datos.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await creditModule.createApplication(applicationDraft);
      setApplicationDraft(null);
      await load();
      toast.success("Solicitud enviada a revisión.");
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : "No se pudo crear la solicitud.";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const saveDecision = async () => {
    if (!decisionApplication) return;
    setSaving(true);
    setError(null);
    try {
      await creditModule.decideApplication(decisionApplication.id, decisionDraft);
      setDecisionApplication(null);
      await load();
      toast.success(decisionDraft.approved ? "Solicitud aprobada." : "Solicitud rechazada.");
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : "No se pudo guardar la decisión.";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const disburse = async (application: CreditApplication) => {
    if (!window.confirm(`¿Desembolsar la solicitud ${application.applicationNumber}?`)) return;
    setSaving(true);
    try {
      await creditModule.disburseApplication(application.id);
      await load();
      toast.success("Préstamo desembolsado y cronograma creado.");
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : "No se pudo desembolsar el préstamo.";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (!canView) return <Navigate to="/not-found" replace />;

  return (
    <PageComponent title="Solicitudes de crédito" description="Registra solicitudes y gestiona la revisión manual. La consulta real al buró queda pendiente de integración." textButton="Nueva solicitud" onclick={openApplication} showButton={canCreate && products.length > 0}>
      {error && !applicationDraft && !decisionApplication && <div role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {loading ? <p className="py-8 text-center text-sm text-slate-500">Cargando solicitudes…</p> : applications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
          <FilePlus2 className="mx-auto mb-3 size-8 text-primary" />
          <p className="font-semibold">No hay solicitudes registradas</p>
          {canCreate && products.length > 0 && <button type="button" onClick={openApplication} className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">Crear solicitud</button>}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="hidden grid-cols-[1fr_1.2fr_1fr_1fr_1fr_auto] gap-3 border-b px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid">
            <span>Solicitud</span><span>Cliente</span><span>Producto</span><span>Monto</span><span>Estado</span><span>Acciones</span>
          </div>
          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {applications.map((application) => (
              <li key={application.id} className="grid gap-2 px-4 py-3 md:grid-cols-[1fr_1.2fr_1fr_1fr_1fr_auto] md:items-center md:gap-3">
                <div><p className="font-semibold">{application.applicationNumber}</p><p className="text-xs text-slate-500">{new Date(application.createdAtUtc).toLocaleDateString()}</p></div>
                <span>{application.customerName}</span>
                <span>{application.productName}</span>
                <span>{application.currencyCode} {application.requestedAmount.toLocaleString()}</span>
                <span className="text-sm">{application.status}</span>
                <div className="flex flex-wrap justify-end gap-2">
                  {canDecide && ["Submitted", "UnderReview"].includes(application.status) && (
                    <button type="button" onClick={() => { setDecisionApplication(application); setDecisionDraft({ approved: true, approvedAmount: application.requestedAmount, approvedTermMonths: application.requestedTermMonths, approvedAnnualRatePercent: undefined, reason: "" }); }} className="rounded-md bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">Revisar</button>
                  )}
                  {canDisburse && application.status === "Approved" && (
                    <button type="button" disabled={saving} onClick={() => void disburse(application)} className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50">Desembolsar</button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Modal isOpen={Boolean(applicationDraft)} onClose={() => setApplicationDraft(null)} title="Nueva solicitud de crédito" textBtnConfirm="Enviar a revisión" clickBtnConfirm={createApplication} disabled={saving || !applicationDraft}>
        {applicationDraft && <div className="grid max-h-[65vh] gap-4 overflow-y-auto p-1 sm:grid-cols-2">
          <PaginatedAutocomplete
            label="Buscar cliente por nombre, identificación o contacto"
            value={applicationDraft.customerId || null}
            onChange={(value) => setApplicationDraft({ ...applicationDraft, customerId: Number(value) || 0 })}
            fetchData={CustomerService.get}
            getValue={(customer) => customer.id}
            getLabel={(customer) => `${customer.firstName} ${customer.lastName} · ${customer.dni}`}
          />
          <label className="space-y-1 text-sm font-medium">Producto<select className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950" value={applicationDraft.creditProductId} onChange={(event) => changeProduct(Number(event.target.value))}>{products.map((product) => <option key={product.id} value={product.id}>{product.name} · {product.currencyCode}</option>)}</select></label>
          <TextFieldApp className="w-full" label="Monto solicitado" type="number" value={String(applicationDraft.requestedAmount)} onChange={(value) => setApplicationDraft({ ...applicationDraft, requestedAmount: Number(value) })} />
          <TextFieldApp className="w-full" label="Plazo (meses)" type="number" value={String(applicationDraft.requestedTermMonths)} onChange={(value) => setApplicationDraft({ ...applicationDraft, requestedTermMonths: Number(value) })} />
          <TextFieldApp className="w-full sm:col-span-2" label="Destino del crédito" value={applicationDraft.purpose} maxLength={250} onChange={(purpose) => setApplicationDraft({ ...applicationDraft, purpose })} />
          <TextFieldApp className="w-full" label="Ingreso mensual" type="number" value={String(applicationDraft.monthlyIncome)} onChange={(value) => setApplicationDraft({ ...applicationDraft, monthlyIncome: Number(value) })} />
          <TextFieldApp className="w-full" label="Gastos mensuales" type="number" value={String(applicationDraft.monthlyExpenses)} onChange={(value) => setApplicationDraft({ ...applicationDraft, monthlyExpenses: Number(value) })} />
          <TextFieldApp className="w-full" label="Otras obligaciones mensuales" type="number" value={String(applicationDraft.existingMonthlyDebt)} onChange={(value) => setApplicationDraft({ ...applicationDraft, existingMonthlyDebt: Number(value) })} />
          <label className="flex items-start gap-2 text-sm sm:col-span-2"><input type="checkbox" checked={applicationDraft.consentToDataProcessing} onChange={(event) => setApplicationDraft({ ...applicationDraft, consentToDataProcessing: event.target.checked })} /><span>Autorizo el uso de mis datos para evaluar esta solicitud. Esta aceptación queda registrada. La consulta a buró aún no está conectada.</span></label>
          {error && <p role="alert" className="text-sm text-red-600 sm:col-span-2">{error}</p>}
        </div>}
      </Modal>

      <Modal isOpen={Boolean(decisionApplication)} onClose={() => setDecisionApplication(null)} title={`Decisión · ${decisionApplication?.applicationNumber ?? ""}`} textBtnConfirm="Guardar decisión" clickBtnConfirm={saveDecision} disabled={saving || !decisionDraft.reason.trim()}>
        {decisionApplication && <div className="space-y-4">
          <div className="flex gap-2">
            <button type="button" onClick={() => setDecisionDraft({ ...decisionDraft, approved: true })} className={`rounded-lg border px-3 py-2 text-sm ${decisionDraft.approved ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-slate-300 dark:border-slate-700"}`}><BadgeCheck className="mr-1 inline size-4" />Aprobar</button>
            <button type="button" onClick={() => setDecisionDraft({ ...decisionDraft, approved: false, approvedAmount: null, approvedTermMonths: null, approvedAnnualRatePercent: null })} className={`rounded-lg border px-3 py-2 text-sm ${!decisionDraft.approved ? "border-red-600 bg-red-50 text-red-700" : "border-slate-300 dark:border-slate-700"}`}><Ban className="mr-1 inline size-4" />Rechazar</button>
          </div>
          {decisionDraft.approved && <div className="grid gap-3 sm:grid-cols-3">
            <TextFieldApp className="w-full" label="Monto aprobado" type="number" value={String(decisionDraft.approvedAmount ?? decisionApplication.requestedAmount)} onChange={(value) => setDecisionDraft({ ...decisionDraft, approvedAmount: Number(value) })} />
            <TextFieldApp className="w-full" label="Plazo aprobado" type="number" value={String(decisionDraft.approvedTermMonths ?? decisionApplication.requestedTermMonths)} onChange={(value) => setDecisionDraft({ ...decisionDraft, approvedTermMonths: Number(value) })} />
            <TextFieldApp className="w-full" label="Tasa anual (%)" type="number" value={String(decisionDraft.approvedAnnualRatePercent ?? "")} onChange={(value) => setDecisionDraft({ ...decisionDraft, approvedAnnualRatePercent: value ? Number(value) : null })} />
          </div>}
          <TextFieldApp className="w-full" label="Motivo de la decisión" value={decisionDraft.reason} maxLength={1000} onChange={(reason) => setDecisionDraft({ ...decisionDraft, reason })} />
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        </div>}
      </Modal>
    </PageComponent>
  );
}
