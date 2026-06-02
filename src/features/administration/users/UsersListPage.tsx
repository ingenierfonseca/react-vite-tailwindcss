import { EllipsisVertical } from "lucide-react";
import { Navigate } from "react-router";
import PageComponent from "../../../components/commons/PageComponent";
import PaginatedDataTable from "../../../components/pagination-data/PaginatedDataTable";
import { useUsers } from "./hooks/useUsers";
import UserForm from "./components/UserForm";
import { usePermissions } from "../../../hooks/usePermissions";
import type { Header } from "../../invoice/components/InvoiceDetail";

const headers: Header[] = [
    { header: "Usuario", className: "flex-2" },
    { header: "Email", className: "flex-3 hidden md:block" },
    { header: "Roles", className: "flex-2" },
    { header: "Estado", className: "flex-1" },
];

const RESOURCE = "users";

export default function UsersListPage() {
    const { can } = usePermissions();
    const {
        isOpenCreateOrEdit, isOpenTransitionRight, openCreate,
        load, data, item, openPopUp, setItem, setOpenPopUp,
        setCurrentPage, pages, resetItem
    } = useUsers();

    if (!can("view", RESOURCE)) {
        return <Navigate to="/not-found" replace />;
    }

    return (
        <PageComponent
            title="Usuarios"
            description="Administra los usuarios y sus permisos en el sistema"
            textButton="Agregar Usuario"
            showButton={can("create", RESOURCE)}
            onclick={() => { resetItem(); openCreate(true); }}
        >
            <PaginatedDataTable
                columns={headers}
                pagination={data}
                pages={pages}
                onPageChange={setCurrentPage}
            >
                <div className="divide-y divide-slate-200 dark:divide-slate-600">
                    {data?.data?.map((item, index) => (
                        <div key={item.id}
                            className={`flex px-4 py-3 gap-2 items-center ${index % 2 !== 0 ? "bg-slate-200 dark:bg-slate-800" : ""} hover:bg-slate-300 dark:hover:bg-slate-800/50 transition-colors`}>
                            <span className="flex-2 dark:text-slate-200">{item.username}</span>
                            <span className="flex-3 hidden md:block dark:text-slate-400">{item.email}</span>
                            <span className="flex-2 dark:text-slate-200">{item.roles.join(", ")}</span>
                            <span className={`flex-1 ${item.isActive ? "text-green-600" : "text-red-500"}`}>
                                {item.isActive ? "Activo" : "Inactivo"}
                            </span>
                            <div className="flex-1 flex justify-end relative">
                                <button onClick={() => setOpenPopUp(item.id)}
                                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                                    <EllipsisVertical size={20} />
                                </button>
                                {openPopUp === item.id && (
                                    <div className="absolute right-0 top-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-md shadow-xl z-50 min-w-30"
                                        onMouseLeave={() => setOpenPopUp(0)}>
                                        {can("update", RESOURCE) && (
                                            <button className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm dark:text-slate-200"
                                                onClick={() => { setItem(item); openCreate(true); }}>
                                                Editar
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </PaginatedDataTable>

            <div className={`fixed top-0 right-0 h-full w-full md:w-7/12 bg-white dark:bg-slate-800 shadow-2xl z-50 
                            transform transition-transform duration-500 ease-in-out 
                            ${isOpenTransitionRight ? "translate-x-0" : "translate-x-full"}`}>
                {isOpenCreateOrEdit && <UserForm setIsOpen={openCreate} itemParam={item} reload={load} />}
            </div>
        </PageComponent>
    );
}
