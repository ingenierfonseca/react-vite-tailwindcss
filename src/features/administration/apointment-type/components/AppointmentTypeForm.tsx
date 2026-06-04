import TextFieldApp from "../../../../components/commons/TextFieldApp"
import { useEffect } from "react";
import ButtonSaveApp from "../../../../components/commons/ButtonSaveApp";
import PageRightComponent from "../../../../components/commons/PageRightComponent";
import type { AppointmentType } from "../../../../models/appointmentType.type";
import { useAppointmentType } from "../hooks/appointmentType.hook";
import { minutesToTime, timeToMinutes } from "../../../../utils/date.util";
import NumberInputApp from "@/components/commons/NumberInputApp";

interface AppointmentTypeFormProps {
    itemParam?: AppointmentType
    setIsOpen: (value: boolean) => void
    reload: () => void
}
export default function AppointmentTypeForm({ itemParam, setIsOpen, reload }: AppointmentTypeFormProps) {
    const { item, setItem, loading, saveTreatment } = useAppointmentType()
    useEffect(() => {
        if (itemParam) {
            //itemParam.durationMinutes = timeToMinutes(itemParam.time)
            setItem(itemParam)
        }
    }, [itemParam])

    const handleSave = async () => {
        const response = await saveTreatment()
        if (response) {
            reload()
            setIsOpen(false)
        }
    }

    return (
        <PageRightComponent
            title={item.id ? 'Editar Tipo de Cita' : `Nuevo Tipo de Cita`}
            onClick={() => setIsOpen(false)}
        >
            <fieldset disabled={loading}>
                <div className="flex flex-col gap-4 pt-3">
                    <TextFieldApp
                        className="flex-3"
                        label="Nombre"
                        value={item.name}
                        maxLength={50}
                        onChange={(value) => setItem({ ...item, name: value })}
                    />
                    <TextFieldApp
                        className="flex-5"
                        label="Descripcion"
                        value={item.description}
                        maxLength={60}
                        onChange={(value) => setItem({ ...item, description: value })}
                    />
                    <NumberInputApp
                        className="flex-1"
                        title="Duración Minutos"
                        value={item.durationMinutes}
                        shrink={true}
                        onChange={(value) => {
                            setItem({ ...item, durationMinutes: value });
                        }}
                    />
                </div>
                <div className="flex justify-center">
                    <ButtonSaveApp
                        className="flex-6"
                        label="Tipo de Cita"
                        onClick={() => handleSave()}
                        loading={loading}
                    />
                </div>
            </fieldset>
        </PageRightComponent>
    )
}