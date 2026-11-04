import { useCallback, useEffect, useState } from "react";
import { Navigate } from "react-router";
import { ClipboardList, PhoneCall } from "lucide-react";
import { toast } from "react-toastify";
import Modal from "@/components/commons/Modal";
import PageComponent from "@/components/commons/PageComponent";
import { usePermissions } from "@/hooks/usePermissions";
import { PermissionAction, PermissionResource } from "@/models/permission.enum";
import { creditModule } from "@/app/composition/credit";
import type { CreateCollectionAction, CreditLoanListItem, LoanCollectionAction } from "../domain/credit.types";

const inputClass = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950";

function emptyAction(): CreateCollectionAction {
  return { actionType: "Call", outcome: "", notes: "" };
}

export default function CreditCollectionsPage() {
  const { can, isSuperAdmin } = usePermissions();
  const canView = isSuperAdmin || can(PermissionAction.View, PermissionResource.CreditCollections);
  const canManage = isSuperAdmin || can(PermissionAction.Manage, PermissionResource.CreditCollections);
  const [loans, setLoans] = useState<CreditLoanListItem[]>([]);
  const [selectedLoan, setSelectedLoan] = useState<CreditLoanListItem | null>(null);
  const [actions, setActions] = useState<LoanCollectionAction[]>([]);
  const [draft, setDraft] = useState<CreateCollectionAction>(emptyAction());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLoans = useCallback(async () => {
    setLoading(true);
    try {
      const page = await creditModule.listLoans(1, 100, "Delinquent");
      setLoans(page.data);
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "No se pudo cargar la cola de cobranza.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadLoans(); }, [loadLoans]);

  const openLoan = async (loan: CreditLoanListItem) => {
    setSelectedLoan(loan);
    try {
      const page = await creditModule.listCollectionActions(loan.id, 1, 100);
      setActions(page.data);
    } catch (loadError) {
      setActions([]);
      setError(loadError instanceof Error ? loadError.message : "No se pudo cargar el historial de gestiones.");
    }
  };

  const saveAction = async () => {
    if (!selectedLoan) return;
    setSaving(true);
    setError(null);
    try {
      await creditModule.addCollectionAction(selectedLoan.id, draft);
      setDraft(emptyAction());
      setIsFormOpen(false);
      const page = await creditModule.listCollectionActions(selectedLoan.id, 1, 100);
      setActions(page.data);
      await loadLoans();
      toast.success("Gestión de cobranza registrada.");
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : "No se pudo registrar la gestión.";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (!canView) return <Navigate to="/not-found" replace />;

  return (
    <PageComponent title="Cobranza" description="Gestiona préstamos vencidos, contactos y promesas de pago." textButton="" onclick={() => {}} showButton={false}>
      {error && <div role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {loading ? <p className="py-8 text-center text-sm text-slate-500">Cargando cartera vencida…</p> : loans.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700"><ClipboardList className="mx-auto mb-3 size-8 text-primary" /><p className="font-semibold">No hay préstamos vencidos</p></div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)]">
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <header className="border-b border-slate-200 p-4 font-semibold dark:border-slate-800">Cola de cobranza · {loans.length}</header>
            <ul className="divide-y divide-slate-200 dark:divide-slate-800">
              {loans.map((loan) => <li key={loan.id}><button type="button" onClick={() => void openLoan(loan)} className={`w-full p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 ${selectedLoan?.id === loan.id ? "bg-primary/5" : ""}`}>
                <div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{loan.customerName}</p><p className="text-xs text-slate-500">{loan.loanNumber} · {loan.productName}</p></div><span className="rounded-full bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-700">{loan.daysPastDue} días</span></div>
                <div className="mt-3 flex justify-between text-sm"><span>Saldo principal</span><strong>{loan.currencyCode} {loan.outstandingPrincipal.toLocaleString()}</strong></div>
                <div className="flex justify-between text-sm text-rose-600"><span>Vencido</span><strong>{loan.currencyCode} {loan.overdueAmount.toLocaleString()}</strong></div>
              </button></li>)}
            </ul>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            {!selectedLoan ? <div className="flex h-full min-h-56 flex-col items-center justify-center p-6 text-center text-slate-500"><PhoneCall className="mb-3 size-7" /><p>Selecciona un préstamo para revisar y registrar gestiones.</p></div> : <>
              <header className="flex items-center justify-between gap-3 border-b border-slate-200 p-4 dark:border-slate-800"><div><h2 className="font-semibold">{selectedLoan.customerName}</h2><p className="text-xs text-slate-500">{selectedLoan.loanNumber} · {selectedLoan.daysPastDue} días de mora</p></div>{canManage && <button type="button" onClick={() => { setDraft(emptyAction()); setIsFormOpen(true); }} className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white">Registrar gestión</button>}</header>
              <div className="max-h-[65vh] overflow-y-auto p-4">
                {actions.length === 0 ? <p className="text-sm text-slate-500">No hay gestiones registradas.</p> : <ol className="space-y-3">
                  {actions.map((action) => <li key={action.id} className="border-l-2 border-primary/40 pl-3">
                    <div className="flex justify-between gap-2"><strong className="text-sm">{action.actionType} · {action.outcome}</strong><span className="text-xs text-slate-500">{new Date(action.createdAtUtc).toLocaleString()}</span></div>
                    {action.notes && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{action.notes}</p>}
                    {action.promiseDate && <p className="mt-1 text-xs text-amber-700">Promesa: {new Date(action.promiseDate).toLocaleDateString()} · {selectedLoan.currencyCode} {action.promiseAmount?.toLocaleString()}</p>}
                    {action.nextContactAtUtc && <p className="mt-1 text-xs text-slate-500">Próximo contacto: {new Date(action.nextContactAtUtc).toLocaleString()}</p>}
                  </li>)}
                </ol>}
              </div>
            </>}
          </section>
        </div>
      )}

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Registrar gestión de cobranza" textBtnConfirm="Guardar gestión" clickBtnConfirm={saveAction} disabled={saving || !draft.outcome.trim()}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1 text-sm font-medium">Tipo<select className={inputClass} value={draft.actionType} onChange={(event) => setDraft({ ...draft, actionType: event.target.value as CreateCollectionAction["actionType"] })}><option value="Call">Llamada</option><option value="Sms">SMS</option><option value="Email">Correo</option><option value="Visit">Visita</option><option value="PromiseToPay">Promesa de pago</option><option value="Note">Nota</option></select></label>
          <label className="space-y-1 text-sm font-medium">Resultado<input className={inputClass} maxLength={100} value={draft.outcome} onChange={(event) => setDraft({ ...draft, outcome: event.target.value })} /></label>
          <label className="space-y-1 text-sm font-medium sm:col-span-2">Notas<textarea className={`${inputClass} min-h-24`} maxLength={1000} value={draft.notes ?? ""} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} /></label>
          {draft.actionType === "PromiseToPay" && <>
            <label className="space-y-1 text-sm font-medium">Monto prometido<input className={inputClass} type="number" min="0.01" step="0.01" value={draft.promiseAmount ?? ""} onChange={(event) => setDraft({ ...draft, promiseAmount: Number(event.target.value) })} /></label>
            <label className="space-y-1 text-sm font-medium">Fecha prometida<input className={inputClass} type="date" value={draft.promiseDate ?? ""} onChange={(event) => setDraft({ ...draft, promiseDate: event.target.value })} /></label>
          </>}
          <label className="space-y-1 text-sm font-medium sm:col-span-2">Próximo contacto<input className={inputClass} type="datetime-local" value={draft.nextContactAtUtc?.slice(0, 16) ?? ""} onChange={(event) => setDraft({ ...draft, nextContactAtUtc: event.target.value ? new Date(event.target.value).toISOString() : undefined })} /></label>
        </div>
      </Modal>
    </PageComponent>
  );
}
