import { useEffect, type ReactNode } from "react";
import type { Client } from "../domain/client";
import { useCreateClient } from "./hooks/useCreateClient";
import PageComponent from "@/components/commons/PageComponent";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { User } from "lucide-react";
import { useClients } from "./hooks/useClients";
import ClientCreate from "./components/create-client/ClientCreate";
import { calculateAgeFromString } from "@/utils/date.util";
import ClientProfile from "./components/ClientProfile";
import type { ClientQueries } from "./types";
import type { ClientModule } from "../application/create-client-module";

export interface ClientsPageProps {
  module: ClientModule<Client>;
  queries: ClientQueries;
  renderMetrics?: ReactNode;
  renderAdittionalInfo?: (
    client: Client,
    getProfile: ClientQueries["getProfile"],
  ) => ReactNode;
  onStartAssessment?: (client: Client) => void;
}
export function ClientsPage({
  module,
  queries,
  renderMetrics,
  renderAdittionalInfo,
}: ClientsPageProps) {
  const clients = useClients(module, queries, !renderMetrics);
  const { state, actions, permissions, labels, avatarUrl, pagination } = clients;
  const { closeTimer, animationFrame } = state;
  const { saving, detailsChanged, saveDraft } = useCreateClient(
    module,
    labels,
    state.draft,
    state.originalDraft,
    actions.setDraft,
    actions.setOriginalDraft,
    actions.setFormError,
    actions.errorMessage,
    actions.reload,
    actions.onError,
    actions.onSaved,
    actions.closePanel,
  );

  useEffect(() => () => {
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    if (animationFrame.current !== null) window.cancelAnimationFrame(animationFrame.current);
  }, [animationFrame, closeTimer]);

  return (
    <PageComponent
      title={labels.title}
      description={labels.description}
      showButton={false}
      textButton={labels.add}
      onclick={actions.openCreate}>
      
        {renderMetrics ? (
            renderMetrics
          ) : (
            state.dashboardData && state.dashboardData.map((dashboard, index) => (
              <div className="flex gap-2 md:gap-8">
                <DashboardCard
                key={`${dashboard.title}-${index}`}
                iconClassName={state.dashboardData.length > 1 ? "hidden md:block" : ""}
                stat={{
                  title: dashboard.title,
                  value: dashboard.value,
                  change: dashboard.change,
                  trend: dashboard.trend,
                  bgColor: "bg-primary/20",
                  iconColor: "text-primary",
                  textColor: "text-blue-500",
                  color: "from-blue-400 to-blue-600",
                  icon: User
                }} />
              </div>
            )
          )
        )}

      <div className="flex my-4">
        <div className="flex-1">
          <label className="sr-only" htmlFor="clients-search">{labels.search}</label>
          <input
            id="clients-search"
            type="search"
            value={state.search}
            placeholder={labels.search}
            onChange={(event) => {
              actions.setLoading(true);
              actions.setPage(1);
              actions.setSearch(event.target.value);
            }}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 md:max-w-md"
          />
        </div>
        {permissions.canCreate && (
            <button type="button" onClick={actions.openCreate} className="ml-auto rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-white cursor-pointer">
              {labels.add}
            </button>
        )}
      </div>

      <section aria-busy={state.loading} className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {state.loading && <div className="px-4 py-3 text-sm text-slate-500">{labels.loading}</div>}
        {state.loadError && <div role="alert" className="p-4 text-sm text-red-600">{state.loadError}</div>}
        {!state.loading && !state.loadError && !state.result?.data.length && (
          <p className="p-5 text-sm text-slate-500">{labels.empty}</p>
        )}
        {!!state.result?.data.length && (
          <>
            <div className="hidden grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto] gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-950 md:grid">
              <span>{labels.profile}</span><span>{labels.emailColumn}</span><span>{labels.phoneColumn}</span><span />
            </div>
            <ul className="divide-y divide-slate-200 dark:divide-slate-800">
              {state.result.data.map((client) => (
                <li key={client.id} className="grid gap-3 px-4 py-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto] md:items-center md:gap-4">
                  <button type="button" onClick={() => actions.showPanel({ type: "profile", client })} className="min-w-0 text-left cursor-pointer">
                    <span className="flex min-w-0 items-center gap-3">
                      {avatarUrl(client) ? (
                        <img src={avatarUrl(client)} alt="" className="size-10 shrink-0 rounded-full object-cover" />
                      ) : (
                        <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {client.firstName.charAt(0)}{client.lastName.charAt(0)}
                        </span>
                      )}
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{client.firstName} {client.lastName}</span>
                        <span className="mt-1 block truncate text-xs text-slate-500">
                          {labels.id_short}: {client.dni} · {calculateAgeFromString(client.birthDate)} {Number(calculateAgeFromString(client.birthDate)) === 1 ? labels.age_one : labels.age_other}
                        </span>
                      </span>
                    </span>
                  </button>
                  <span className="truncate text-sm text-slate-500">{client.email || "—"}</span>
                  <span className="text-sm text-slate-500">{client.phone || "—"}</span>
                  <span className="flex justify-end">
                    {permissions.canEdit && (
                      <button type="button" onClick={() => actions.openEdit(client)} className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                        {labels.edit}
                      </button>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
        {pagination.totalPages > 1 && (
          <footer className="flex items-center justify-between border-t border-slate-200 px-4 py-3 dark:border-slate-800">
            <button type="button" disabled={state.page <= 1 || state.loading} onClick={() => { actions.setLoading(true); actions.setPage((value) => value - 1); }} className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-40">
              {labels.previous}
            </button>
            <span className="text-sm text-slate-500">{state.page} / {pagination.totalPages}</span>
            <button type="button" disabled={state.page >= pagination.totalPages || state.loading} onClick={() => { actions.setLoading(true); actions.setPage((value) => value + 1); }} className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-40">
              {labels.next}
            </button>
          </footer>
        )}
      </section>

      {state.panel && (
        <div className="pointer-events-none fixed inset-0 z-50" role="presentation">
          <div
            className={`pointer-events-auto fixed right-0 top-0 z-10 h-full w-full overflow-y-auto bg-white shadow-2xl transition-transform duration-500 ease-in-out dark:bg-slate-900 
              ${state.panelWidthClassName ?? "md:max-w-2xl"} 
              ${state.panelClassName ?? ""} 
              ${state.panelVisible ? "translate-x-0" : "translate-x-full"}`}
              role="dialog"
              aria-modal="true"
              aria-label={state.panel.type === "form" ? labels.edit : labels.profile}
              inert={!state.panelVisible}
          >
            {state.panel.type === "form" && state.draft && (
              <ClientCreate
                client={state.draft}
                labels={labels}
                saving={saving}
                canSave={state.draft.id <= 0 || detailsChanged}
                error={state.formError}
                onChange={actions.patchDraft}
                onSubmit={saveDraft}
                onCancel={actions.closePanel}
                geography={{
                  getDepartments: queries.getDepartments,
                  getCities: queries.getCities,
                }}
              />
            )} 
            {state.panel.type === "profile" && (
              <ClientProfile
                client={state.panel.client}
                onCancel={actions.closePanel}
                labels={labels}
                renderAdittionalInfo={renderAdittionalInfo?.(state.panel.client, queries.getProfile)}
                onEdit={(isEditing) => { if (isEditing) actions.openEdit(state.panel!.client); }}
              />
            )}
            {state.panel.type === "others" && (
              <ClientProfile
                client={state.panel.client}
                onCancel={actions.closePanel}
                labels={labels}
                renderAdittionalInfo={renderAdittionalInfo?.(state.panel.client, queries.getProfile)}
                onEdit={(isEditing) => { if (isEditing) actions.openEdit(state.panel!.client); }}
              />
            )}
          </div>
        </div>
      )}

    </PageComponent>
  )
}
