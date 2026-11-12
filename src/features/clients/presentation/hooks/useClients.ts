import { useCallback, useEffect, useRef, useState } from "react";
import type { Client, ClientPage } from "../../domain/client";
import type { CustomerDashboard } from "@/services/customer/customer.type";
import type { ClientModule } from "../../application/create-client-module";
import type { ClientQueries } from "../types";
import { usePermissions } from "@/hooks/usePermissions";
import { PermissionAction, PermissionResource } from "@/models/permission.enum";
import { ASSETS_URLS } from "@/config/constants";
import { useClientLabels } from "@/shared/hooks/useClientLabels";
import { toast } from "react-toastify";

type PanelState<TClient> =
  | { type: "profile"; client: TClient }
  | { type: "form"; client: TClient }
  | { type: "others"; client: TClient }
  | null;

const createEmptyClient = (): Client => ({
  id: 0,
  idType: 1,
  dni: "",
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  address: "",
  birthDate: "",
  gender: "",
});

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export const useClients = (
  module: ClientModule<Client>,
  queries: ClientQueries,
  loadDashboard = true,
) => {
  const labels = useClientLabels();
  const errorMessage = useCallback(
    (error: unknown) => getErrorMessage(error, labels.unexpected_error),
    [labels.unexpected_error],
  );
  const { can } = usePermissions();
  const canCreate = can(PermissionAction.Create, PermissionResource.Patients);
  const canEdit = can(PermissionAction.Update, PermissionResource.Patients);
  const [draft, setDraft] = useState<Client | null>(null);
  const [originalDraft, setOriginalDraft] = useState<Client | null>(null);
  const [dashboardData, setDashboardData] = useState<CustomerDashboard[]>([]);
  const [result, setResult] = useState<ClientPage<Client>>();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [panel, setPanel] = useState<PanelState<Client>>(null);
  const [panelVisible, setPanelVisible] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const animationFrame = useRef<number | null>(null);
  const panelClassName = "dark:bg-slate-800";
  const panelWidthClassName = "md:w-7/12 md:max-w-none";

  useEffect(() => {
    if (!loadDashboard) return;
    let active = true;
    queries.getDashboard()
      .then((data) => {
        if (active) setDashboardData(data);
      })
      .catch(() => {
        if (active) setDashboardData([]);
      });

    return () => { active = false; };
  }, [loadDashboard, queries]);

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
  }, [errorMessage, module, page, reloadKey, search]);

  const showPanel = (nextPanel: NonNullable<PanelState<Client>>) => {
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
    const client = createEmptyClient();
    setFormError(null);
    setDraft(client);
    setOriginalDraft(null);
    showPanel({ type: "form", client });
  };

  const openEdit = (client: Client) => {
    const snapshot = { ...client };
    setFormError(null);
    setDraft(snapshot);
    setOriginalDraft(snapshot);
    showPanel({ type: "form", client: snapshot });
  };

  const closePanel = () => {
    setPanelVisible(false);
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setPanel(null);
      setDraft(null);
      setOriginalDraft(null);
      setFormError(null);
      closeTimer.current = null;
    }, 500);
  };

  const reload = useCallback(() => {
    setLoading(true);
    setReloadKey((current) => current + 1);
  }, []);

  const patchDraft = (patch: Partial<Client>) => {
    setDraft((current) => current ? { ...current, ...patch } : current);
  };

  const avatarUrl = (client: Client) => (
    client.avatar && !client.avatar.includes("null")
      ? `${ASSETS_URLS.avatars}${client.avatar}`
      : undefined
  );

  const onSaved = (wasUpdate: boolean) => {
    toast.success(wasUpdate
      ? labels.entity_updated_successfully
      : labels.entity_created_successfully);
  };
  const onError = (message: string) => toast.error(message);
  const totalPages = result?.totalPages ?? 1;

  return {
    state: {
      animationFrame,
      closeTimer,
      draft,
      originalDraft,
      search,
      page,
      loading,
      loadError,
      result,
      dashboardData,
      formError,
      panel,
      panelClassName,
      panelVisible,
      panelWidthClassName,
      reloadKey,
    },
    permissions: { canCreate, canEdit },
    actions: {
      closePanel,
      errorMessage,
      showPanel,
      onError,
      onSaved,
      openCreate,
      openEdit,
      reload,
      setDraft,
      setOriginalDraft,
      setSearch,
      setPage,
      setLoading,
      setFormError,
      patchDraft,
    },
    pagination: { totalPages },
    labels,
    avatarUrl,
  };
};
