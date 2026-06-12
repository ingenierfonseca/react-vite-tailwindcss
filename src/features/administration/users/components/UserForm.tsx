import { useEffect } from "react";
import ButtonSaveApp from "../../../../components/commons/ButtonSaveApp";
import PageRightComponent from "../../../../components/commons/PageRightComponent";
import DropDownApp from "../../../../components/commons/DropDownApp";
import PermissionGrid from "./PermissionGrid";
import { useUser } from "../hooks/useUser";
import type { AdminUser } from "../../../../models/adminUser.type";
import { Role } from "../../../../models/auth.type";

interface UserFormProps {
    itemParam?: AdminUser;
    setIsOpen: (value: boolean) => void;
    reload: () => void;
}

const roleOptions = [
    { id: Role.SuperAdmin, value: "SuperAdmin" },
    { id: Role.Admin, value: "Admin" },
    { id: Role.Doctor, value: "Doctor" },
    { id: Role.Recepcionista, value: "Recepcionista" },
];

export default function UserForm({ itemParam, setIsOpen, reload }: UserFormProps) {
    const { item, setItem, loading, save } = useUser();

    useEffect(() => {
        if (itemParam) setItem(itemParam);
    }, [itemParam]);

    const handleSave = async () => {
        const response = await save();
        if (response) { reload(); setIsOpen(false); }
    };

    const selectedRoleId = item.roles.length > 0 ? item.roles[0] : "";

    const handleRoleChange = (value: string) => {
        setItem({ ...item, roles: [value] });
    };

    return (
        <PageRightComponent
            title={item.id ? "Editar Usuario" : "Nuevo Usuario"}
            onClick={() => setIsOpen(false)}
        >
            <fieldset disabled={loading}>
                <div className="flex flex-col gap-4 pt-3">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Usuario: <span className="font-semibold text-slate-700 dark:text-slate-200">{item.username || "—"}</span>
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Email: <span className="font-semibold text-slate-700 dark:text-slate-200">{item.email || "—"}</span>
                    </p>

                    <DropDownApp
                        title="Rol"
                        data={roleOptions}
                        value={selectedRoleId}
                        onChange={handleRoleChange}
                    />

                    <div>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                            Permisos
                        </p>
                        <PermissionGrid
                            permissions={item.permissions}
                            onChange={(permissions) => setItem({ ...item, permissions })}
                        />
                    </div>
                </div>

                <div className="flex justify-center">
                    <ButtonSaveApp className="flex-6" label="Usuario" onClick={handleSave} loading={loading} />
                </div>
            </fieldset>
        </PageRightComponent>
    );
}
