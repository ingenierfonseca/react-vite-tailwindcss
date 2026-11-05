import { lazy, Suspense, useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, Clock3, MapPin, RefreshCw, Search, SignalZero, Smartphone } from "lucide-react";
import { Navigate } from "react-router";
import PageComponent from "@/components/commons/PageComponent";
import { usePermissions } from "@/hooks/usePermissions";
import { PermissionAction, PermissionResource } from "@/models/permission.enum";
import { staffLocationRepository } from "@/app/composition/staff-location";
import type { Branch, LocationAvailability, StaffCurrentLocation } from "../domain/staff-location.types";
import { demoBranches, getDemoStaffLocations } from "./demo-staff-locations";
const StaffLocationMap = lazy(() => import("./StaffLocationMap").then((module) => ({ default: module.StaffLocationMap })));

const statusLabels: Record<LocationAvailability, string> = {
  Online: "En línea",
  Alert: "Alerta",
  Offline: "Sin señal",
  PhoneOff: "Teléfono apagado (reportado)",
  NeverReported: "Sin ubicación",
};

function timeAgo(seconds?: number | null) {
  if (seconds == null) return "Sin reportes";
  if (seconds < 60) return `hace ${seconds} s`;
  const minutes = Math.floor(seconds / 60);
  return `hace ${minutes} min`;
}

function StatusGlyph({ availability }: { availability: LocationAvailability }) {
  const common = "size-4";
  if (availability === "Alert") return <AlertTriangle className={common} />;
  if (availability === "Offline") return <SignalZero className={common} />;
  if (availability === "PhoneOff") return <Smartphone className={common} />;
  if (availability === "NeverReported") return <MapPin className={common} />;
  return <Activity className={common} />;
}

function statusClass(availability: LocationAvailability) {
  switch (availability) {
    case "Alert": return "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300";
    case "Offline": return "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200";
    case "PhoneOff": return "bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200";
    case "NeverReported": return "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300";
    default: return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300";
  }
}

function displayedAvailability(location: StaffCurrentLocation): LocationAvailability {
  if (location.reportedState === "Alert") return "Alert";
  if (location.reportedState === "PhoneOff") return "PhoneOff";
  return location.availability;
}

function statusLabel(location: StaffCurrentLocation) {
  if (location.reportedState === "Alert" && location.isStale) return "Alerta · sin señal";
  if (location.reportedState === "PhoneOff" && location.isStale) return "Apagado reportado · desactualizado";
  return statusLabels[displayedAvailability(location)];
}

function LocationRow({
  location,
  selected,
  onClick,
}: {
  location: StaffCurrentLocation;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full border-b border-slate-100 px-4 py-3 text-left transition-colors last:border-0 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary dark:border-slate-800 dark:hover:bg-slate-800/70 ${selected ? "bg-primary/5 dark:bg-primary/10" : ""}`}
    >
      <div className="flex items-start gap-3">
        <span className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-full ${statusClass(displayedAvailability(location))}`}>
          <StatusGlyph availability={displayedAvailability(location)} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center justify-between gap-2">
            <span className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{location.staffName}</span>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusClass(displayedAvailability(location))}`}>
              {statusLabel(location)}
            </span>
          </span>
          <span className="mt-1 block truncate text-xs text-slate-500 dark:text-slate-400">{location.staffType} · {location.branchName}</span>
          <span className="mt-2 flex items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1"><Clock3 className="size-3" />{timeAgo(location.secondsSinceLastReport)}</span>
            {location.accuracyMeters != null && <span>±{Math.round(location.accuracyMeters)} m</span>}
          </span>
          {location.alertMessage && <span className="mt-2 block text-xs font-medium text-rose-700 dark:text-rose-300">{location.alertMessage}</span>}
        </span>
      </div>
    </button>
  );
}

export default function StaffLocationMonitorPage() {
  const { can, isSuperAdmin } = usePermissions();
  const canViewLocations = isSuperAdmin || can(PermissionAction.View, PermissionResource.StaffLocations);
  const canViewBranches = isSuperAdmin || can(PermissionAction.View, PermissionResource.Branches);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [locations, setLocations] = useState<StaffCurrentLocation[]>([]);
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState<StaffCurrentLocation | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadBranches = useCallback(async () => {
    if (demoMode && import.meta.env.DEV) {
      setBranches(demoBranches);
      return;
    }
    if (!canViewBranches) return;
    try {
      setBranches(await staffLocationRepository.getBranches(true));
    } catch {
      setError("No se pudieron cargar las sucursales. Verifica el permiso branches.view.");
    }
  }, [canViewBranches, demoMode]);

  const loadLocations = useCallback(async (quiet = false) => {
    if (!canViewLocations) return;
    if (quiet) setRefreshing(true);
    else setLoading(true);
    try {
      if (demoMode && import.meta.env.DEV) {
        const query = deferredSearch.trim().toLowerCase();
        const result = getDemoStaffLocations().filter((location) => {
          const matchesBranch = selectedBranch === "all" || location.branchId === Number(selectedBranch);
          const matchesSearch = !query || `${location.staffName} ${location.username} ${location.staffType}`.toLowerCase().includes(query);
          const matchesState = selectedState === "all"
            || (selectedState === "alert" && location.reportedState === "Alert")
            || (selectedState === "phoneoff" && location.reportedState === "PhoneOff")
            || (selectedState === "neverreported" && location.availability === "NeverReported")
            || (selectedState === "offline" && location.availability === "Offline")
            || (selectedState === "online" && location.availability === "Online");
          return matchesBranch && matchesSearch && matchesState;
        });
        setLocations(result);
        setLastUpdated(new Date());
        setError(null);
        setSelectedLocation((current) => current ? result.find((item) => item.userId === current.userId) ?? null : null);
        return;
      }

      const result = await staffLocationRepository.getLatestLocations({
        branchId: selectedBranch === "all" ? undefined : Number(selectedBranch),
        state: selectedState,
        search: deferredSearch.trim() || undefined,
      });
      setLocations(result);
      setLastUpdated(new Date());
      setError(null);
      setSelectedLocation((current) => current ? result.find((item) => item.userId === current.userId) ?? null : null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "No se pudo cargar la ubicación del personal.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [canViewLocations, deferredSearch, demoMode, selectedBranch, selectedState]);

  useEffect(() => { void loadBranches(); }, [loadBranches]);
  useEffect(() => { void loadLocations(); }, [loadLocations]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") void loadLocations(true);
    }, 30_000);
    return () => window.clearInterval(timer);
  }, [loadLocations]);

  const counts = useMemo(() => ({
    online: locations.filter((item) => item.availability === "Online").length,
    alerts: locations.filter((item) => item.reportedState === "Alert").length,
    phoneOff: locations.filter((item) => item.reportedState === "PhoneOff").length,
    offline: locations.filter((item) => item.availability === "Offline").length,
    never: locations.filter((item) => item.availability === "NeverReported").length,
  }), [locations]);

  const toggleDemoMode = () => {
    if (!import.meta.env.DEV) return;
    setDemoMode((current) => !current);
    setSelectedBranch("all");
    setSelectedState("all");
    setSelectedLocation(null);
  };

  if (!canViewLocations) return <Navigate to="/not-found" replace />;

  return (
    <PageComponent
      title="Ubicación del personal"
      description="Último reporte recibido de cada empleado vinculado a una cuenta."
      textButton=""
      onclick={() => {}}
      showButton={false}
      secondaryButton={import.meta.env.DEV ? <button type="button" onClick={toggleDemoMode} className={`rounded-lg border px-3 py-2 text-xs font-semibold ${demoMode ? "border-amber-400 bg-amber-50 text-amber-900" : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"}`}>{demoMode ? "Salir de demo" : "Ver datos demo"}</button> : undefined}
    >
      <div className="space-y-4">
        {demoMode && import.meta.env.DEV && <div role="status" className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">MODO DEMO · ubicaciones ficticias solo para previsualizar la pantalla; no se envían ni se guardan.</div>}
        <div className="grid grid-cols-2 gap-2 xl:grid-cols-5">
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900"><span className="flex items-center gap-2 text-xs text-slate-500"><Activity className="size-3.5 text-emerald-600" />En línea</span><strong className="mt-1 block text-xl tabular-nums">{counts.online}</strong></div>
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900"><span className="flex items-center gap-2 text-xs text-slate-500"><AlertTriangle className="size-3.5 text-rose-600" />Alertas</span><strong className="mt-1 block text-xl tabular-nums">{counts.alerts}</strong></div>
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900"><span className="flex items-center gap-2 text-xs text-slate-500"><SignalZero className="size-3.5 text-slate-600" />Sin señal</span><strong className="mt-1 block text-xl tabular-nums">{counts.offline}</strong></div>
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900"><span className="flex items-center gap-2 text-xs text-slate-500"><Smartphone className="size-3.5 text-zinc-600" />Teléfono apagado</span><strong className="mt-1 block text-xl tabular-nums">{counts.phoneOff}</strong></div>
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900"><span className="flex items-center gap-2 text-xs text-slate-500"><MapPin className="size-3.5 text-amber-600" />Sin ubicación</span><strong className="mt-1 block text-xl tabular-nums">{counts.never}</strong></div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(330px,390px)_minmax(0,1fr)]">
          <section className="order-2 flex min-h-120 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 xl:order-1 xl:h-[calc(100vh-235px)] xl:min-h-140">
            <div className="space-y-3 border-b border-slate-200 p-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <label className="relative min-w-0 flex-1">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar empleado" className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 dark:border-slate-700 dark:bg-slate-950" />
                </label>
                <button type="button" onClick={() => void loadLocations(true)} disabled={refreshing} aria-label="Actualizar ubicaciones" className="grid size-9 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                  <RefreshCw className={`size-4 ${refreshing ? "animate-spin" : ""}`} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="min-w-0"><span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-500">Sucursal</span><select value={selectedBranch} onChange={(event) => setSelectedBranch(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs dark:border-slate-700 dark:bg-slate-950"><option value="all">Todas</option>{branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}</select></label>
                <label className="min-w-0"><span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-500">Estado</span><select value={selectedState} onChange={(event) => setSelectedState(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs dark:border-slate-700 dark:bg-slate-950"><option value="all">Todos</option><option value="online">En línea</option><option value="alert">Alerta</option><option value="offline">Sin señal</option><option value="phoneoff">Teléfono apagado</option><option value="neverreported">Sin ubicación</option></select></label>
              </div>
              <p className="flex items-center justify-between text-[11px] text-slate-500"><span>{locations.length} empleados</span><span>{lastUpdated ? `Actualizado ${lastUpdated.toLocaleTimeString("es-NI", { timeZone: "America/Managua" })}` : "Esperando datos"}</span></p>
            </div>

            {error && <div role="alert" className="mx-3 mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">{error}</div>}
            <div className="min-h-0 flex-1 overflow-y-auto">
              {loading ? <div className="space-y-3 p-4" aria-label="Cargando personal">{Array.from({ length: 5 }, (_, index) => <div key={index} className="h-16 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />)}</div>
                : locations.length === 0 ? <div className="p-8 text-center text-sm text-slate-500">No hay empleados para estos filtros.</div>
                  : locations.map((location) => <LocationRow key={location.userId} location={location} selected={selectedLocation?.userId === location.userId} onClick={() => setSelectedLocation(location)} />)}
            </div>
            <div className="border-t border-slate-200 px-3 py-2 text-[10px] leading-relaxed text-slate-500 dark:border-slate-800">“Sin señal” se infiere tras 2 minutos sin reportes. “Teléfono apagado” solo aparece cuando la app envía explícitamente ese estado.</div>
          </section>

          <section className="order-1 min-w-0 xl:order-2">
            <Suspense fallback={<div className="grid h-[56vh] min-h-97.5 place-items-center rounded-xl border border-slate-200 bg-slate-100 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800">Cargando mapa…</div>}>
              <StaffLocationMap locations={locations} selectedUserId={selectedLocation?.userId ?? null} onSelect={setSelectedLocation} />
            </Suspense>
            {selectedLocation && <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900"><div><strong>{selectedLocation.staffName}</strong><span className="ml-2 text-slate-500">{statusLabel(selectedLocation)} · {selectedLocation.branchName}</span></div><span className="text-xs tabular-nums text-slate-500">{selectedLocation.latitude != null ? `${selectedLocation.latitude.toFixed(6)}, ${selectedLocation.longitude?.toFixed(6)}` : "Sin coordenadas"}</span></div>}
          </section>
        </div>
      </div>
    </PageComponent>
  );
}
