import { useEffect } from "react";
import { Checkbox, FormControlLabel } from "@mui/material";
import { RefreshCw } from "lucide-react";
import ButtonSaveApp from "../../../../components/commons/ButtonSaveApp";
import PageRightComponent from "../../../../components/commons/PageRightComponent";
import TextFieldApp from "../../../../components/commons/TextFieldApp";
import { useUser } from "../hooks/useUser";
import type { AdminUser } from "../../../../models/adminUser.type";

interface UserFormProps {
    itemParam?: AdminUser;
    setIsOpen: (value: boolean) => void;
    reload: () => void;
}

export default function UserForm({ itemParam, setIsOpen, reload }: UserFormProps) {
    const {
        item, setItem, loading, save,
        password, resetPassword, roles,
        selectedRoleIds, setSelectedRoleIds,
        loadUserRoles, resetItem,
    } = useUser();

    const isEditing = !!itemParam?.id;

    useEffect(() => {
        if (itemParam) {
            setItem(itemParam);
            if (itemParam.id) loadUserRoles(itemParam.id);
        } else {
            resetItem();
        }
    }, [itemParam, setItem, loadUserRoles, resetItem]);

    const handleSave = async () => {
        const response = await save();
        if (response) { reload(); setIsOpen(false); }
    };

    const toggleRole = (roleId: number) => {
        setSelectedRoleIds((prev) =>
            prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
        );
    };

    return (
        <PageRightComponent
            title={isEditing ? "Editar Usuario" : "Nuevo Usuario"}
            onClick={() => setIsOpen(false)}
        >
            <fieldset disabled={loading}>
                <div className="flex flex-col gap-4 pt-3">
                    <TextFieldApp
                        label="Usuario"
                        className="w-full"
                        value={item.username}
                        onChange={(value) => setItem({ ...item, username: value })}
                    />

                    <TextFieldApp
                        label="Email"
                        className="w-full"
                        value={item.email}
                        onChange={(value) => setItem({ ...item, email: value })}
                    />

                    {!isEditing && (
                        <div>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">
                                Contraseña temporal
                            </p>
                            <div className="flex gap-2 items-center">
                                <input
                                    type="text"
                                    readOnly
                                    value={password}
                                    className="flex-1 border border-slate-300 dark:border-slate-600 rounded px-3 py-2 bg-slate-100 dark:bg-slate-800 text-sm dark:text-slate-200"
                                />
                                <button
                                    type="button"
                                    onClick={resetPassword}
                                    className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                                    title="Regenerar contraseña"
                                >
                                    <RefreshCw size={18} className="text-slate-500" />
                                </button>
                            </div>
                        </div>
                    )}

                    {isEditing && (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={item.isActive}
                                    onChange={(e) => setItem({ ...item, isActive: e.target.checked })}
                                />
                            }
                            label="Activo"
                        />
                    )}

                    <div>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                            Roles
                        </p>
                        <div className="flex flex-col gap-1">
                            {roles.map((role) => (
                                <FormControlLabel
                                    key={role.id}
                                    control={
                                        <Checkbox
                                            checked={selectedRoleIds.includes(role.id)}
                                            onChange={() => toggleRole(role.id)}
                                        />
                                    }
                                    label={role.name}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-center">
                    <ButtonSaveApp className="flex-6" label="Usuario" onClick={handleSave} loading={loading} />
                </div>
            </fieldset>
        </PageRightComponent>
    );
}
