import { Navigate } from "react-router";
import { Trash2 } from "lucide-react";
import PageComponent from "../../../components/commons/PageComponent";
import PaginatedDataTable from "../../../components/pagination-data/PaginatedDataTable";
import { usePermissions } from "../../../hooks/usePermissions";
import { PermissionAction, PermissionResource } from "../../../models/permission.enum";
import { useUserRoles } from "./hooks/useUserRoles";
import { useUserRole } from "./hooks/useUserRole";
import UserRoleForm from "./components/UserRoleForm";
import type { Header } from "../../invoice/components/InvoiceDetail";

const headers: Header[] = [
    { header: "Usuario", className: "flex-2" },
    { header: "Rol", className: "flex-2" },
    { header: "Acciones", className: "flex-1 text-right" },
];

const RESOURCE = PermissionResource.UserRoles;

export default function UserRoleListPage() {
    const { can } = usePermissions();
    const {
        isOpenCreateOrEdit, isOpenTransitionRight, openCreate,
        load, data, setCurrentPage, pages,
    } = useUserRoles();
    const { remove } = useUserRole();

    if (!can(PermissionAction.View, RESOURCE)) {
        return <Navigate to="/not-found" replace />;
    }

    const handleDelete = async (userId: number, roleId: number) => {
        const ok = await remove(userId, roleId);
        if (ok) load();
    };

    return (
        <PageComponent
            title="Roles de Usuario"
            description="Administra la asignación de roles a usuarios"
            textButton="Asignar Rol"
            showButton={can(PermissionAction.Create, RESOURCE)}
            onclick={() => openCreate(true)}
        >
            <PaginatedDataTable
                columns={headers}
                pagination={data}
                pages={pages}
                onPageChange={setCurrentPage}
            >
                <div className="divide-y divide-slate-200 dark:divide-slate-600">
                    {data?.data?.map((item, index) => (
                        <div key={`${item.userId}-${item.roleId}`}
                            className={`flex px-4 py-3 gap-2 items-center ${index % 2 !== 0 ? "bg-slate-200 dark:bg-slate-800" : ""} hover:bg-slate-300 dark:hover:bg-slate-800/50 transition-colors`}>
                            <span className="flex-2 dark:text-slate-200">{item.userName || `ID: ${item.userId}`}</span>
                            <span className="flex-2 dark:text-slate-400">{item.roleName || `ID: ${item.roleId}`}</span>
                            <div className="flex-1 flex justify-end">
                                {can(PermissionAction.Update, RESOURCE) && (
                                    <button
                                        onClick={() => handleDelete(item.userId, item.roleId)}
                                        className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-colors cursor-pointer"
                                        title="Remover rol"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </PaginatedDataTable>

            <div className={`fixed top-0 right-0 h-full w-full md:w-7/12 bg-white dark:bg-slate-800 shadow-2xl z-50 
                            transform transition-transform duration-500 ease-in-out 
                            ${isOpenTransitionRight ? "translate-x-0" : "translate-x-full"}`}>
                {isOpenCreateOrEdit && <UserRoleForm setIsOpen={openCreate} reload={load} />}
            </div>
        </PageComponent>
    );
}
