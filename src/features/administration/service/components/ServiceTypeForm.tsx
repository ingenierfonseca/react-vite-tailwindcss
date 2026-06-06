import TextFieldApp from "../../../../components/commons/TextFieldApp";
import { useEffect } from "react";
import ButtonSaveApp from "../../../../components/commons/ButtonSaveApp";
import PageRightComponent from "../../../../components/commons/PageRightComponent";
import { useService } from "../hooks/useService";
import type { Service } from "@/models/service.type";

interface ServiceFormProps {
    itemParam?: Service;
    setIsOpen: (value: boolean) => void;
    reload: () => void;
}

export default function ServiceForm({ itemParam, setIsOpen, reload }: ServiceFormProps) {
    const { item, setItem, loading, save } = useService();

    useEffect(() => {
        if (itemParam) setItem(itemParam);
    }, [itemParam]);

    const handleSave = async () => {
        const response = await save();
        if (response) { reload(); setIsOpen(false); }
    };

    return (
        <PageRightComponent
            title={item.id ? "Editar Tipo de Consulta" : "Nuevo Tipo de Consulta"}
            onClick={() => setIsOpen(false)}
        >
            <fieldset disabled={loading}>
                <div className="flex flex-col gap-4 pt-3">
                    <TextFieldApp className="flex-3" label="Nombre" value={item.name}
                        maxLength={100} onChange={(value) => setItem({ ...item, name: value })} />
                </div>
                <div className="flex justify-center">
                    <ButtonSaveApp className="flex-6" label="Tipo de Consulta" onClick={handleSave} loading={loading} />
                </div>
            </fieldset>
        </PageRightComponent>
    );
}
