import TextFieldApp from "../../../../components/commons/TextFieldApp";
import { useEffect } from "react";
import ButtonSaveApp from "../../../../components/commons/ButtonSaveApp";
import PageRightComponent from "../../../../components/commons/PageRightComponent";
import { Checkbox, FormControlLabel } from "@mui/material";
import type { ConsultationType } from "../../../../models/consultationType.type";
import { useConsultationType } from "../hooks/useConsultationType";

interface ConsultationTypeFormProps {
    itemParam?: ConsultationType;
    setIsOpen: (value: boolean) => void;
    reload: () => void;
}

export default function ConsultationTypeForm({ itemParam, setIsOpen, reload }: ConsultationTypeFormProps) {
    const { item, setItem, loading, save } = useConsultationType();

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
            onClose={() => setIsOpen(false)}
        >
            <fieldset disabled={loading}>
                <div className="flex flex-col gap-4 pt-3">
                    <TextFieldApp label="Nombre" value={item.name}
                        maxLength={100} onChange={(value) => setItem({ ...item, name: value })} />
                    <TextFieldApp label="Descripción" value={item.description ?? ""}
                        maxLength={200} onChange={(value) => setItem({ ...item, description: value })} />
                    <FormControlLabel
                        control={
                            <Checkbox
                                className="dark:text-primary-dark!"
                                checked={item.isActive}
                                onChange={(e) => setItem({ ...item, isActive: e.target.checked })}
                            />
                        }
                        label="Activo" />
                </div>
                <div className="flex justify-center">
                    <ButtonSaveApp className="flex-6" label="Tipo de Consulta" onClick={handleSave} loading={loading} />
                </div>
            </fieldset>
        </PageRightComponent>
    );
}
