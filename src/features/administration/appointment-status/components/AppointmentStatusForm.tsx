import TextFieldApp from "../../../../components/commons/TextFieldApp";
import { useEffect } from "react";
import ButtonSaveApp from "../../../../components/commons/ButtonSaveApp";
import PageRightComponent from "../../../../components/commons/PageRightComponent";
import type { AppointmentStatus } from "../../../../models/appointmentStatus.type";
import { useAppointmentStatus } from "../hooks/useAppointmentStatus";

interface AppointmentStatusFormProps {
    itemParam?: AppointmentStatus;
    setIsOpen: (value: boolean) => void;
    reload: () => void;
}

export default function AppointmentStatusForm({ itemParam, setIsOpen, reload }: AppointmentStatusFormProps) {
    const { item, setItem, loading, save } = useAppointmentStatus();

    useEffect(() => {
        if (itemParam) setItem(itemParam);
    }, [itemParam]);

    const handleSave = async () => {
        const response = await save();
        if (response) { reload(); setIsOpen(false); }
    };

    return (
        <PageRightComponent
            title={item.id ? "Editar Estado de Cita" : "Nuevo Estado de Cita"}
            onClick={() => setIsOpen(false)}
        >
            <fieldset disabled={loading}>
                <div className="flex flex-col gap-4 pt-3">
                    <TextFieldApp className="flex-3" label="Nombre" value={item.name}
                        maxLength={100} onChange={(value) => setItem({ ...item, name: value })} />
                </div>
                <div className="flex justify-center">
                    <ButtonSaveApp className="flex-6" label="Estado de Cita" onClick={handleSave} loading={loading} />
                </div>
            </fieldset>
        </PageRightComponent>
    );
}
