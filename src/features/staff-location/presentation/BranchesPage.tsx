import { useCallback, useEffect, useState } from "react";
import { Navigate } from "react-router";
import { Building2, MapPin, Plus, Save, Users } from "lucide-react";
import { toast } from "react-toastify";
import Modal from "@/components/commons/Modal";
import PageComponent from "@/components/commons/PageComponent";
import { usePermissions } from "@/hooks/usePermissions";
import { PermissionAction, PermissionResource } from "@/models/permission.enum";
import { staffLocationRepository } from "@/app/composition/staff-location";
import type { Branch, CreateBranch, StaffAssignment } from "../domain/staff-location.types";

const inputClass = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-950";
const blankBranch: CreateBranch = { code: "", name: "", address: "", city: "" };

export default function BranchesPage() {
  const { can, isSuperAdmin } = usePermissions();
  const canView = isSuperAdmin || can(PermissionAction.View, PermissionResource.Branches);
  const canManage = isSuperAdmin || can(PermissionAction.Manage, PermissionResource.Branches);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [staff, setStaff] = useState<StaffAssignment[]>([]);
  const [assignmentDrafts, setAssignmentDrafts] = useState<Record<number, string>>({});
  const [branchDraft, setBranchDraft] = useState<CreateBranch>(blankBranch);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingStaffId, setSavingStaffId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const branchList = await staffLocationRepository.getBranches(false);
      setBranches(branchList);
      if (canManage) {
        const staffList = await staffLocationRepository.getStaffAssignments();
        setStaff(staffList);
        setAssignmentDrafts(Object.fromEntries(staffList.map((item) => [item.staffId, item.branchId ? String(item.branchId) : ""])));
      }
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "No se pudieron cargar las sucursales.");
    } finally {
      setLoading(false);
    }
  }, [canManage]);

  useEffect(() => { void load(); }, [load]);

  const createBranch = async () => {
    setSaving(true);
    setError(null);
    try {
      await staffLocationRepository.createBranch({
        ...branchDraft,
        code: branchDraft.code.trim().toUpperCase(),
        name: branchDraft.name.trim(),
      });
      setFormOpen(false);
      setBranchDraft(blankBranch);
      await load();
      toast.success("Sucursal creada.");
    } catch (createError) {
      const message = createError instanceof Error ? createError.message : "No se pudo crear la sucursal.";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const assign = async (employee: StaffAssignment) => {
    const branchId = Number(assignmentDrafts[employee.staffId]);
    if (!branchId) return;
    setSavingStaffId(employee.staffId);
    try {
      await staffLocationRepository.assignStaff(branchId, employee.staffId);
      await load();
      toast.success(`${employee.name} asignado a la sucursal.`);
    } catch (assignError) {
      toast.error(assignError instanceof Error ? assignError.message : "No se pudo asignar el empleado.");
    } finally {
      setSavingStaffId(null);
    }
  };

  if (!canView) return <Navigate to="/not-found" replace />;

  return (
    <PageComponent title="Sucursales" description="Organiza el personal por sede para filtrar el monitoreo de ubicación." textButton="Nueva sucursal" onclick={() => { setError(null); setBranchDraft(blankBranch); setFormOpen(true); }} showButton={canManage}>
      {error && <div role="alert" className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</div>}

      {loading ? <p className="py-10 text-center text-sm text-slate-500">Cargando sucursales…</p> : branches.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 px-6 py-12 text-center dark:border-slate-700">
          <Building2 className="mx-auto mb-3 size-8 text-primary" />
          <h2 className="font-semibold">No hay sucursales configuradas</h2>
          <p className="mt-1 text-sm text-slate-500">Crea las sedes reales y asigna cada empleado; no se asignarán empleados automáticamente.</p>
          {canManage && <button type="button" onClick={() => setFormOpen(true)} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"><Plus className="size-4" />Crear primera sucursal</button>}
        </div>
      ) : (
        <div className="space-y-5">
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {branches.map((branch) => <article key={branch.id} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-start justify-between gap-3"><div className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary"><Building2 className="size-5" /></div><span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">{branch.code}</span></div>
              <h2 className="mt-3 font-semibold">{branch.name}</h2>
              <p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><MapPin className="size-3" />{[branch.address, branch.city].filter(Boolean).join(" · ") || "Dirección no registrada"}</p>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500"><Users className="size-3.5" />{branch.staffCount} personas asignadas</p>
            </article>)}
          </section>

          {canManage && <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <header className="border-b border-slate-200 px-4 py-3 dark:border-slate-800"><h2 className="font-semibold">Asignación de personal</h2><p className="mt-0.5 text-xs text-slate-500">Solo las personas con usuario vinculado reportarán ubicación.</p></header>
            {staff.length === 0 ? <p className="p-4 text-sm text-slate-500">No hay personal activo.</p> : <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {staff.map((employee) => <div key={employee.staffId} className="grid gap-2 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_minmax(180px,240px)_auto] sm:items-center">
                <div><p className="text-sm font-medium">{employee.name}</p><p className="text-xs text-slate-500">{employee.staffType} · {employee.hasLogin ? "Usuario vinculado" : "Sin usuario vinculado"}</p></div>
                <select aria-label={`Sucursal para ${employee.name}`} value={assignmentDrafts[employee.staffId] ?? ""} onChange={(event) => setAssignmentDrafts((current) => ({ ...current, [employee.staffId]: event.target.value }))} className={inputClass}>
                  <option value="">Selecciona una sucursal</option>
                  {branches.filter((branch) => branch.isActive).map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
                </select>
                <button type="button" onClick={() => void assign(employee)} disabled={!assignmentDrafts[employee.staffId] || savingStaffId === employee.staffId} className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"><Save className="size-3.5" />{savingStaffId === employee.staffId ? "Guardando" : "Asignar"}</button>
              </div>)}
            </div>}
          </section>}
        </div>
      )}

      <Modal isOpen={formOpen} onClose={() => setFormOpen(false)} title="Nueva sucursal" textBtnConfirm="Crear sucursal" clickBtnConfirm={createBranch} disabled={saving || !branchDraft.code.trim() || !branchDraft.name.trim()}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1 text-sm font-medium">Código<input className={inputClass} maxLength={30} value={branchDraft.code} onChange={(event) => setBranchDraft({ ...branchDraft, code: event.target.value.toUpperCase() })} /></label>
          <label className="space-y-1 text-sm font-medium">Nombre<input className={inputClass} maxLength={120} value={branchDraft.name} onChange={(event) => setBranchDraft({ ...branchDraft, name: event.target.value })} /></label>
          <label className="space-y-1 text-sm font-medium">Dirección<input className={inputClass} maxLength={250} value={branchDraft.address ?? ""} onChange={(event) => setBranchDraft({ ...branchDraft, address: event.target.value })} /></label>
          <label className="space-y-1 text-sm font-medium">Ciudad<input className={inputClass} maxLength={100} value={branchDraft.city ?? ""} onChange={(event) => setBranchDraft({ ...branchDraft, city: event.target.value })} /></label>
          {error && <p role="alert" className="text-sm text-rose-700 sm:col-span-2">{error}</p>}
        </div>
      </Modal>
    </PageComponent>
  );
}
