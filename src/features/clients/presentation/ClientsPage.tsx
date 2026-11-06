import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { Client, ClientPage } from "../domain/client";
import type { ClientModule } from "../application/create-client-module";
import { ClientForm } from "./ClientForm";
import { useClientLabels } from "@/shared/hooks/useClientLabels";

export type ClientsPageLabels = ReturnType<typeof useClientLabels>;

export interface ClientProfileActions {
  onClose: () => void;
  onEdit: () => void;
}

export interface ClientFormRenderProps<TClient extends Client> {
  client: TClient;
  labels: ClientsPageLabels;
  saving: boolean;
  error: string | null;
  avatarUrl?: (client: TClient) => string | undefined;
  onChange: (patch: Partial<TClient>) => void;
  onSubmit: (avatar: File | null) => Promise<void>;
  onCancel: () => void;
}

export interface ClientsPageProps<TClient extends Client> {
  module: ClientModule<TClient>;
  createClient: () => TClient;
  labels: ClientsPageLabels;
  canCreate?: boolean;
  canEdit?: boolean;
  validateClient?: (client: TClient) => string | null;
  onSaved?: (client: TClient, wasUpdate: boolean) => void;
  onError?: (message: string) => void;
  avatarUrl?: (client: TClient) => string | undefined;
  renderMetrics?: ReactNode;
  renderRowDetails?: (client: TClient) => ReactNode;
  renderAdditionalFields?: (
    client: TClient,
    patchClient: (patch: Partial<TClient>) => void,
  ) => ReactNode;
  renderProfile?: (client: TClient, actions: ClientProfileActions) => ReactNode;
  renderForm?: (props: ClientFormRenderProps<TClient>) => ReactNode;
  panelBackdrop?: boolean;
  panelWidthClassName?: string;
  panelClassName?: string;
}

type PanelState<TClient> =
  | { type: "profile"; client: TClient }
  | { type: "form"; client: TClient }
  | null;

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Ocurrió un error inesperado.";
}

export function ClientsPage<TClient extends Client>({
  module,
  createClient,
  labels,
  canCreate = true,
  canEdit = true,
  validateClient,
  onSaved,
  onError,
  avatarUrl,
  renderMetrics,
  renderRowDetails,
  renderAdditionalFields,
  renderProfile,
  renderForm,
  panelBackdrop = true,
  panelWidthClassName,
  panelClassName,
}: ClientsPageProps<TClient>) {
  const [result, setResult] = useState<ClientPage<TClient>>();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [panel, setPanel] = useState<PanelState<TClient>>(null);
  const [panelVisible, setPanelVisible] = useState(false);
  const [draft, setDraft] = useState<TClient | null>(null);
  const closeTimer = useRef<number | null>(null);
  const animationFrame = useRef<number | null>(null);

  useEffect(() => () => {
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    if (animationFrame.current !== null) window.cancelAnimationFrame(animationFrame.current);
  }, []);

  useEffect(() => {
    let active = true;
    module.list({ page, search })
      .then((response) => {
        if (active) {
          setResult(response);
          setLoadError(null);
        }
      })
      .catch((error: unknown) => {
        if (active) setLoadError(errorMessage(error));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [module, page, reloadKey, search]);

  const reload = useCallback(() => {
    setLoading(true);
    setReloadKey((current) => current + 1);
  }, []);

  const showPanel = (nextPanel: NonNullable<PanelState<TClient>>) => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setPanel(nextPanel);
    if (!panelVisible) {
      if (animationFrame.current !== null) window.cancelAnimationFrame(animationFrame.current);
      animationFrame.current = window.requestAnimationFrame(() => {
        setPanelVisible(true);
        animationFrame.current = null;
      });
    }
  };

  const openCreate = () => {
    setFormError(null);
    const client = createClient();
    setDraft(client);
    showPanel({ type: "form", client });
  };

  const openEdit = (client: TClient) => {
    setFormError(null);
    setDraft(client);
    showPanel({ type: "form", client });
  };

  const closePanel = () => {
    setPanelVisible(false);
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setPanel(null);
      setDraft(null);
      setFormError(null);
      closeTimer.current = null;
    }, 500);
  };

  const patchDraft = (patch: Partial<TClient>) => {
    setDraft((current) => current ? { ...current, ...patch } : current);
  };

  const saveDraft = async (avatar: File | null) => {
    if (!draft) return;
    const wasUpdate = draft.id > 0;
    const validationError = validateClient?.(draft);
    if (validationError) {
      setFormError(validationError);
      onError?.(validationError);
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      const savedClient = await module.save(draft);
      setDraft(savedClient);
      if (avatar && module.uploadAvatar) {
        await module.uploadAvatar(savedClient.id, avatar);
      }
      onSaved?.(savedClient, wasUpdate);
      closePanel();
      reload();
    } catch (error) {
      const message = errorMessage(error);
      setFormError(message);
      onError?.(message);
    } finally {
      setSaving(false);
    }
  };

  const totalPages = result?.totalPages ?? 1;

  return (
    <main className="relative min-h-screen bg-white px-4 pb-12 pt-5 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <header className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{labels.title}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{labels.description}</p>
        </div>
        {canCreate && (
          <button type="button" onClick={openCreate} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">
            {labels.add}
          </button>
        )}
      </header>

      {renderMetrics}

      <div className="my-4">
        <label className="sr-only" htmlFor="clients-search">{labels.search}</label>
        <input
          id="clients-search"
          type="search"
          value={search}
          placeholder={labels.search}
          onChange={(event) => {
            setLoading(true);
            setPage(1);
            setSearch(event.target.value);
          }}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 md:max-w-md"
        />
      </div>

      <section aria-busy={loading} className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {loading && <div className="px-4 py-3 text-sm text-slate-500">Cargando…</div>}
        {loadError && <div role="alert" className="p-4 text-sm text-red-600">{loadError}</div>}
        {!loading && !loadError && result?.data.length === 0 && (
          <p className="p-5 text-sm text-slate-500">{labels.empty}</p>
        )}
        {!!result?.data.length && (
          <>
            <div className="hidden grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto] gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-950 md:grid">
              <span>{labels.profile}</span><span>{labels.emailColumn}</span><span>{labels.phoneColumn}</span><span />
            </div>
            <ul className="divide-y divide-slate-200 dark:divide-slate-800">
              {result.data.map((client) => (
                <li key={client.id} className="grid gap-3 px-4 py-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto] md:items-center md:gap-4">
                  <button type="button" onClick={() => showPanel({ type: "profile", client })} className="min-w-0 text-left">
                    <span className="flex min-w-0 items-center gap-3">
                      {avatarUrl?.(client) ? (
                        <img src={avatarUrl(client)} alt="" className="size-10 shrink-0 rounded-full object-cover" />
                      ) : (
                        <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {client.firstName.charAt(0)}{client.lastName.charAt(0)}
                        </span>
                      )}
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{client.firstName} {client.lastName}</span>
                        {renderRowDetails?.(client)}
                      </span>
                    </span>
                  </button>
                  <span className="truncate text-sm text-slate-500">{client.email || "—"}</span>
                  <span className="text-sm text-slate-500">{client.phone || "—"}</span>
                  <span className="flex justify-end">
                    {canEdit && (
                      <button type="button" onClick={() => openEdit(client)} className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                        {labels.edit}
                      </button>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
        {totalPages > 1 && (
          <footer className="flex items-center justify-between border-t border-slate-200 px-4 py-3 dark:border-slate-800">
            <button type="button" disabled={page <= 1 || loading} onClick={() => { setLoading(true); setPage((value) => value - 1); }} className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-40">
              {labels.previous}
            </button>
            <span className="text-sm text-slate-500">{page} / {totalPages}</span>
            <button type="button" disabled={page >= totalPages || loading} onClick={() => { setLoading(true); setPage((value) => value + 1); }} className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-40">
              {labels.next}
            </button>
          </footer>
        )}
      </section>

      {panel && (
        <div className="pointer-events-none fixed inset-0 z-50" role="presentation">
          {panelBackdrop && (
            <button
              type="button"
              tabIndex={-1}
              aria-label="Cerrar panel"
              onClick={closePanel}
              className={`pointer-events-auto absolute inset-0 bg-slate-950/40 transition-opacity duration-500 ${panelVisible ? "opacity-100" : "opacity-0"}`}
            />
          )}
          <div
            className={`pointer-events-auto fixed right-0 top-0 z-10 h-full w-full overflow-y-auto bg-white shadow-2xl transition-transform duration-500 ease-in-out dark:bg-slate-900 ${panelWidthClassName ?? "md:max-w-2xl"} ${panelClassName ?? ""} ${panelVisible ? "translate-x-0" : "translate-x-full"}`}
            role="dialog"
            aria-modal="true"
            aria-label={panel.type === "form" ? labels.edit : labels.profile}
            aria-hidden={!panelVisible}
          >
            {panel.type === "form" && draft ? (
              renderForm ? renderForm({
                client: draft,
                labels,
                saving,
                error: formError,
                avatarUrl,
                onChange: patchDraft,
                onSubmit: saveDraft,
                onCancel: closePanel,
              }) : (
                <ClientForm
                  client={draft}
                  labels={labels}
                  saving={saving}
                  error={formError}
                  enableAvatarUpload={Boolean(module.uploadAvatar)}
                  avatarUrl={avatarUrl}
                  renderAdditionalFields={renderAdditionalFields}
                  onChange={patchDraft}
                  onSubmit={saveDraft}
                  onCancel={closePanel}
                />
              )
            ) : panel.type === "profile" && renderProfile ? (
              renderProfile(panel.client, {
                onClose: closePanel,
                onEdit: () => openEdit(panel.client),
              })
            ) : panel.type === "profile" ? (
              <section className="h-full bg-white p-6 dark:bg-slate-900">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{labels.profile}</h2>
                  <button type="button" onClick={closePanel} aria-label="Cerrar perfil" className="text-2xl">&times;</button>
                </div>
                {avatarUrl?.(panel.client) && <img src={avatarUrl(panel.client)} alt="" className="mb-4 h-24 w-24 rounded-full object-cover" />}
                <h3 className="text-lg font-medium">{panel.client.firstName} {panel.client.lastName}</h3>
                <p className="mt-2 text-sm">{panel.client.email}</p>
                <p className="text-sm">{panel.client.phone}</p>
                <p className="text-sm">{panel.client.address}</p>
                {canEdit && <button type="button" onClick={() => openEdit(panel.client)} className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">{labels.edit}</button>}
              </section>
            ) : null}
          </div>
        </div>
      )}
    </main>
  );
}
