import { useEffect } from "react";
import ButtonSaveApp from "../../../../components/commons/ButtonSaveApp";
import PageRightComponent from "../../../../components/commons/PageRightComponent";
import DropDownApp from "../../../../components/commons/DropDownApp";
import { useUserRole } from "../hooks/useUserRole";

interface UserRoleFormProps {
    setIsOpen: (value: boolean) => void;
    reload: () => void;
}

export default function UserRoleForm({ setIsOpen, reload }: UserRoleFormProps) {
    const {
        loading, save,
        selectedUserId, setSelectedUserId,
        selectedRoleId, setSelectedRoleId,
        users, roles, resetItem,
    } = useUserRole();

    useEffect(() => {
        resetItem();
    }, []);

    const handleSave = async () => {
        const response = await save();
        if (response) { reload(); resetItem(); setIsOpen(false); }
    };

    const userOptions = users.map((u) => ({
        id: u.id,
        value: `${u.username} (${u.email})`,
    }));

    const roleOptions = roles.map((r) => ({
        id: r.id,
        value: r.name,
    }));

    return (
        <PageRightComponent
            title="Asignar Rol a Usuario"
            onClick={() => setIsOpen(false)}
        >
            <fieldset disabled={loading}>
                <div className="flex flex-col gap-4 pt-3">
                    <DropDownApp
                        title="Usuario"
                        data={userOptions}
                        value={selectedUserId}
                        onChange={(value) => setSelectedUserId(Number(value))}
                    />

                    <DropDownApp
                        title="Rol"
                        data={roleOptions}
                        value={selectedRoleId}
                        onChange={(value) => setSelectedRoleId(Number(value))}
                    />
                </div>

                <div className="flex justify-center">
                    <ButtonSaveApp className="flex-6" label="Asignación" onClick={handleSave} loading={loading} />
                </div>
            </fieldset>
        </PageRightComponent>
    );
}
