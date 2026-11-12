import { useCallback, useRef, useState } from "react";
import type { Client, ClientPage } from "../../domain/client";
import type { CustomerDashboard } from "@/services/customer/customer.type";
import { usePermissions } from "@/hooks/usePermissions";
import { PermissionAction, PermissionResource } from "@/models/permission.enum";
import { ASSETS_URLS } from "@/config/constants";
import { useClientLabels } from "@/shared/hooks/useClientLabels";
import { customerClientModule } from "@/app/composition/clients";
import { toast } from "react-toastify";

type PanelState<TClient> =
    | { type: "profile"; client: TClient }
    | { type: "form"; client: TClient }
    | { type: "others"; client: TClient }
    | null;

export const useClients = () => {
    const labels = useClientLabels();
    const { can } = usePermissions();
    const module = customerClientModule;
    const canCreate = can(PermissionAction.Create, PermissionResource.Patients)
    const canEdit = can(PermissionAction.Update, PermissionResource.Patients)
    const [draft, setDraft] = useState<Client | null>(null);
    const [dashboardData, setDashboardData] = useState<CustomerDashboard[]>([]);
    const [result, setResult] = useState<ClientPage<Client>>();
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [reloadKey, setReloadKey] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [assessmentCustomer, setAssessmentCustomer] = useState<Client | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [panel, setPanel] = useState<PanelState<Client>>(null);
    const [panelVisible, setPanelVisible] = useState(false);
    const closeTimer = useRef<number | null>(null);
    const animationFrame = useRef<number | null>(null);
    const panelClassName = "dark:bg-slate-800"
    const panelWidthClassName = "md:w-7/12 md:max-w-none"

    function errorMessage(error: unknown) {
        return error instanceof Error ? error.message : "Ocurrió un error inesperado.";
    }

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
        setFormError(null);
        const client = createClient;
        setDraft(client);
        showPanel({ type: "form", client });
    };

    const openEdit = (client: Client) => {
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

    const reload = useCallback(() => {
        setLoading(true);
        setReloadKey((current) => current + 1);
      }, []);

    const patchDraft = (patch: Partial<Client>) => {
        setDraft((current) => current ? { ...current, ...patch } : current);
    };

    const avatarUrl = (client: Client) => {
        const avatar = client.avatar && !client.avatar!.includes("null") ? `${ASSETS_URLS.avatars}${client.avatar}` : undefined;
        //console.log("avatar", avatar)
        return avatar
    }

    const onSaved =(wasUpdate: boolean) => { toast.success(wasUpdate ? labels.entity_updated_successfully : labels.entity_created_successfully)}
    const onError = (message: string) => toast.error(message)

    const totalPages = result?.totalPages ?? 1;

    const createClient = {
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
    }

    return {
        state: {
            animationFrame,
            closeTimer,
            draft,
            search,
            page,
            loading,
            result,
            dashboardData,
            formError,
            panel,
            panelClassName,
            panelVisible,
            panelWidthClassName,
            reloadKey
        },
        permissions: {
            canCreate,
            canEdit
        },
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
            setSearch,
            setPage,
            setLoading,
            setLoadError,
            setReloadKey,
            setResult,
            setDashboardData,
            setFormError,
            setAssessmentCustomer,
            patchDraft
        },
        pagination: {
            totalPages
        },
        module,
        labels,
        avatarUrl
    }
}