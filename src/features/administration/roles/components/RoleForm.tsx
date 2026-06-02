import TextFieldApp from "../../../../components/commons/TextFieldApp";
import { useEffect } from "react";
import ButtonSaveApp from "../../../../components/commons/ButtonSaveApp";
import PageRightComponent from "../../../../components/commons/PageRightComponent";
import type { AppRole } from "../../../../models/appRole.type";
import { useRole } from "../hooks/useRole";

interface RoleFormProps {
    itemParam?: AppRole;
    setIsOpen: (value: boolean) => void;
    reload: () => void;
}

export default function RoleForm({ itemParam, setIsOpen, reload }: RoleFormProps) {
    const { item, setItem, loading, save } = useRole();

    useEffect(() => {
        if (itemParam) setItem(itemParam);
    }, [itemParam]);

    const handleSave = async () => {
        const response = await save();
        if (response) { reload(); setIsOpen(false); }
    };

    return (
        <PageRightComponent
            title={item.id ? "Editar Rol" : "Nuevo Rol"}
            onClick={() => setIsOpen(false)}
        >
            <fieldset disabled={loading}>
                <div className="flex flex-col gap-4 pt-3">
                    <TextFieldApp className="flex-3" label="Nombre del Rol" value={item.name}
                        maxLength={50} onChange={(value) => setItem({ ...item, name: value })} />
                </div>
                <div className="flex justify-center">
                    <ButtonSaveApp className="flex-6" label="Rol" onClick={handleSave} loading={loading} />
                </div>
            </fieldset>
        </PageRightComponent>
    );
}
