import { useCallback, useEffect, useState } from "react";
import { Navigate } from "react-router";
import { CircleDollarSign, Clock3, CreditCard, Search, Wallet } from "lucide-react";
import { toast } from "react-toastify";
import PageComponent from "@/components/commons/PageComponent";
import Modal from "@/components/commons/Modal";
import { usePermissions } from "@/hooks/usePermissions";
import { PermissionAction, PermissionResource } from "@/models/permission.enum";
import { creditModule } from "@/app/composition/credit";
import type { CreditLoanListItem, CreditPortfolioSummary, Loan, PaymentMethod } from "../domain/credit.types";

const inputClass = "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950";

function formatMoney(amount: number, code: string) {
  return `${code} ${amount.toLocaleString("es-NI", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function idempotencyKey() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function CreditPortfolioPage() {
  const { can, isSuperAdmin } = usePermissions();
  const canView = isSuperAdmin || can(PermissionAction.View, PermissionResource.CreditLoans);
  const canPay = isSuperAdmin || can(PermissionAction.Create, PermissionResource.CreditPayments);
  const [summary, setSummary] = useState<CreditPortfolioSummary | null>(null);
  const [loans, setLoans] = useState<CreditLoanListItem[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentTypeId, setPaymentTypeId] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [portfolioSummary, loanPage, methods] = await Promise.all([
        creditModule.getPortfolioSummary(),
        creditModule.listLoans(1, 100, status || undefined, search || undefined),
        canPay ? creditModule.listPaymentMethods() : Promise.resolve([]),
      ]);
      setSummary(portfolioSummary);
      setLoans(loanPage.data);
      setPaymentMethods(methods);
      if (!paymentTypeId && methods.length > 0) setPaymentTypeId(String(methods[0].id));
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "No se pudo cargar la cartera.");
    } finally {
      setLoading(false);
    }
  }, [canPay, paymentTypeId, search, status]);

  useEffect(() => { void load(); }, [load]);

  const openLoan = async (loanId: number) => {
    try {
      setSelectedLoan(await creditModule.getLoan(loanId));
    } catch (loadError) {
      toast.error(loadError instanceof Error ? loadError.message : "No se pudo abrir el préstamo.");
    }
  };

  const openPayment = () => {
    setPaymentAmount("");
    setPaymentReference("");
    setPaymentOpen(true);
  };

  const savePayment = async () => {
    if (!selectedLoan || !paymentAmount || Number(paymentAmount) <= 0 || !paymentTypeId) return;
    setSaving(true);
    try {
      await creditModule.registerPayment(selectedLoan.id, {
        amount: Number(paymentAmount),
        paymentTypeId: Number(paymentTypeId),
        paidAtUtc: new Date().toISOString(),
        reference: paymentReference || undefined,
        idempotencyKey: idempotencyKey(),
      });
      setPaymentOpen(false);
      await openLoan(selectedLoan.id);
      await load();
      toast.success("Pago registrado y aplicado a las cuotas exigibles más antiguas.");
    } catch (paymentError) {
      toast.error(paymentError instanceof Error ? paymentError.message : "No se pudo registrar el pago.");
    } finally {
      setSaving(false);
    }
  };

  if (!canView) return <Navigate to="/not-found" replace />;

  return (
    <PageComponent title="Cartera de préstamos" description="Consulta saldos, vencimientos y actividad de pago." textButton="" onclick={() => {}} showButton={false}>
      {error && <div role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"><p className="text-sm text-slate-500">Préstamos activos</p><p className="mt-2 flex items-center gap-2 text-2xl font-bold"><Wallet className="size-5 text-primary" />{summary?.activeLoanCount ?? 0}</p></article>
        <article className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"><p className="text-sm text-slate-500">Con mora</p><p className="mt-2 flex items-center gap-2 text-2xl font-bold"><Clock3 className="size-5 text-rose-500" />{summary?.overdueLoanCount ?? 0}</p></article>
        {(summary?.byCurrency ?? []).map((currency) => <article key={currency.currencyId} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"><p className="text-sm text-slate-500">Saldo principal · {currency.currencyCode}</p><p className="mt-2 flex items-center gap-2 text-xl font-bold"><CircleDollarSign className="size-5 text-primary" />{formatMoney(currency.outstandingPrincipal, currency.currencyCode)}</p><p className="mt-1 text-xs text-rose-600">Vencido: {formatMoney(currency.overdueAmount, currency.currencyCode)}</p></article>)}
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <label className="relative min-w-60 flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input className={`${inputClass} w-full pl-9`} value={search} placeholder="Buscar por préstamo o cliente" onChange={(event) => setSearch(event.target.value)} /></label>
        <select className={inputClass} value={status} onChange={(event) => setStatus(event.target.value)}><option value="">Todos los estados</option><option value="Active">Al día</option><option value="Delinquent">En mora</option><option value="Paid">Pagados</option><option value="WrittenOff">Castigados</option></select>
      </div>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {loading ? <p className="p-5 text-sm text-slate-500">Cargando cartera…</p> : loans.length === 0 ? <p className="p-5 text-sm text-slate-500">No hay préstamos que coincidan con el filtro.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-950"><tr><th className="p-3">Préstamo</th><th className="p-3">Cliente</th><th className="p-3">Producto</th><th className="p-3">Principal pendiente</th><th className="p-3">Vencido</th><th className="p-3">Días mora</th><th className="p-3">Estado</th><th className="p-3" /></tr></thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {loans.map((loan) => <tr key={loan.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50"><td className="p-3"><button type="button" onClick={() => void openLoan(loan.id)} className="font-semibold text-primary hover:underline">{loan.loanNumber}</button></td><td className="p-3">{loan.customerName}</td><td className="p-3">{loan.productName}</td><td className="p-3">{formatMoney(loan.outstandingPrincipal, loan.currencyCode)}</td><td className="p-3">{formatMoney(loan.overdueAmount, loan.currencyCode)}</td><td className="p-3">{loan.daysPastDue}</td><td className="p-3">{loan.status}</td><td className="p-3"><button type="button" aria-label="Ver préstamo" onClick={() => void openLoan(loan.id)} className="rounded-md p-2 text-primary hover:bg-primary/10"><CreditCard className="size-4" /></button></td></tr>)}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Modal isOpen={Boolean(selectedLoan)} onClose={() => setSelectedLoan(null)} title={`Préstamo ${selectedLoan?.loanNumber ?? ""}`} textBtnConfirm="Cerrar" clickBtnConfirm={() => setSelectedLoan(null)} disabled={false}>
        {selectedLoan && <div className="max-h-[70vh] space-y-5 overflow-y-auto">
          <div className="grid gap-3 rounded-xl bg-slate-50 p-4 text-sm dark:bg-slate-800 sm:grid-cols-3"><div><p className="text-slate-500">Cliente</p><p className="font-semibold">{selectedLoan.customerName}</p></div><div><p className="text-slate-500">Principal pendiente</p><p className="font-semibold">{formatMoney(selectedLoan.outstandingPrincipal, selectedLoan.currencyCode)}</p></div><div><p className="text-slate-500">Tasa nominal anual</p><p className="font-semibold">{selectedLoan.annualRatePercent.toFixed(2)}%</p></div></div>
          {canPay && selectedLoan.status !== "Paid" && <button type="button" onClick={openPayment} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">Registrar pago</button>}
          <div><h3 className="mb-2 font-semibold">Cronograma de cuotas</h3><div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700"><table className="w-full min-w-[650px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-950"><tr><th className="p-2">#</th><th className="p-2">Vence</th><th className="p-2">Capital</th><th className="p-2">Interés</th><th className="p-2">Comisión</th><th className="p-2">Saldo cuota</th><th className="p-2">Estado</th></tr></thead><tbody className="divide-y divide-slate-200 dark:divide-slate-800">{selectedLoan.installments.map((item) => <tr key={item.id}><td className="p-2">{item.number}</td><td className="p-2">{new Date(item.dueDate).toLocaleDateString()}</td><td className="p-2">{formatMoney(item.principalDue, selectedLoan.currencyCode)}</td><td className="p-2">{formatMoney(item.interestDue, selectedLoan.currencyCode)}</td><td className="p-2">{formatMoney(item.feesDue, selectedLoan.currencyCode)}</td><td className="p-2">{formatMoney(item.balance, selectedLoan.currencyCode)}</td><td className="p-2">{item.status}</td></tr>)}</tbody></table></div></div>
          <div><h3 className="mb-2 font-semibold">Pagos registrados</h3>{selectedLoan.payments.length===0 ? <p className="text-sm text-slate-500">Aún no hay pagos.</p> : <ul className="divide-y divide-slate-200 dark:divide-slate-800">{selectedLoan.payments.map((payment) => <li key={payment.id} className="flex flex-wrap justify-between gap-2 py-2 text-sm"><span>{new Date(payment.paidAtUtc).toLocaleDateString()} · {payment.paymentMethod}</span><span className="font-semibold">{formatMoney(payment.amount, payment.currencyCode)}</span></li>)}</ul>}</div>
          <div><h3 className="mb-2 font-semibold">Movimientos del préstamo</h3>{selectedLoan.ledgerEntries.map((entry) => <div key={entry.id} className="flex justify-between gap-2 border-b border-slate-100 py-2 text-xs dark:border-slate-800"><span>{entry.description} · {new Date(entry.createdAtUtc).toLocaleDateString()}</span><span>{formatMoney(entry.amount, selectedLoan.currencyCode)}</span></div>)}</div>
        </div>}
      </Modal>

      <Modal isOpen={paymentOpen} onClose={() => setPaymentOpen(false)} title="Registrar pago de préstamo" textBtnConfirm="Aplicar pago" clickBtnConfirm={savePayment} disabled={saving || !paymentAmount || !paymentTypeId}>
        {selectedLoan && <div className="space-y-4">
          <p className="text-sm text-slate-500">El pago se aplicará a las cuotas exigibles más antiguas, primero a comisiones, luego intereses y capital. Pagos anticipados requieren definir la política del producto.</p>
          <p className="rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-800">Moneda del préstamo: <strong>{selectedLoan.currencyCode}</strong></p>
          <label className="block space-y-1 text-sm font-medium">Método de pago<select className={`${inputClass} w-full`} value={paymentTypeId} onChange={(event) => setPaymentTypeId(event.target.value)}>{paymentMethods.map((method) => <option key={method.id} value={method.id}>{method.name}</option>)}</select></label>
          <label className="block space-y-1 text-sm font-medium">Monto<input className={`${inputClass} w-full`} type="number" min="0.01" step="0.01" value={paymentAmount} onChange={(event) => setPaymentAmount(event.target.value)} /></label>
          <label className="block space-y-1 text-sm font-medium">Referencia (opcional)<input className={`${inputClass} w-full`} maxLength={100} value={paymentReference} onChange={(event) => setPaymentReference(event.target.value)} /></label>
        </div>}
      </Modal>
    </PageComponent>
  );
}
