import TextFieldApp from "../../../../components/commons/TextFieldApp";
import { useEffect } from "react";
import ButtonSaveApp from "../../../../components/commons/ButtonSaveApp";
import PageRightComponent from "../../../../components/commons/PageRightComponent";
import type { ResourceType } from "../../../../models/resourceType.type";
import { useResourceType } from "../hooks/useResourceType";

interface ResourceTypeFormProps {
    itemParam?: ResourceType;
    setIsOpen: (value: boolean) => void;
    reload: () => void;
}

export default function ResourceTypeForm({ itemParam, setIsOpen, reload }: ResourceTypeFormProps) {
    const { item, setItem, loading, save } = useResourceType();

    useEffect(() => {
        if (itemParam) setItem(itemParam);
    }, [itemParam]);

    const handleSave = async () => {
        const response = await save();
        if (response) { reload(); setIsOpen(false); }
    };

    return (
        <PageRightComponent
            title={item.id ? "Editar Tipo de Recurso" : "Nuevo Tipo de Recurso"}
            onClick={() => setIsOpen(false)}
        >
            <fieldset disabled={loading}>
                <div className="flex flex-col gap-4 pt-3">
                    <TextFieldApp className="flex-3" label="Nombre" value={item.name}
                        maxLength={100} onChange={(value) => setItem({ ...item, name: value })} />
                </div>
                <div className="flex justify-center">
                    <ButtonSaveApp className="flex-6" label="Tipo de Recurso" onClick={handleSave} loading={loading} />
                </div>
            </fieldset>
        </PageRightComponent>
    );
}
