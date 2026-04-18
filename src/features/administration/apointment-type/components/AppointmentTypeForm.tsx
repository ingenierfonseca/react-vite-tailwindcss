import TextFieldApp from "../../../../components/commons/TextFieldApp"
import { useEffect } from "react";
import ButtonSaveApp from "../../../../components/commons/ButtonSaveApp";
import PageRightComponent from "../../../../components/commons/PageRightComponent";
import type { AppointmentType } from "../../../../services/types/appointmentType.type";
import { useAppointmentType } from "../hooks/appointmentType.hook";
import { minutesToTime, timeToMinutes } from "../../../../utils/date.util";
import { TextField } from "@mui/material";

interface AppointmentTypeFormProps {
    itemParam?: AppointmentType
    setIsOpen: (value: boolean) => void
    reload: () => void
}
export default function AppointmentTypeForm({ itemParam, setIsOpen, reload }: AppointmentTypeFormProps) {
    const { item, setItem, loading, saveTreatment } = useAppointmentType()
    useEffect(() => {
        if (itemParam) {
            item.timeMinutes = timeToMinutes(item.time)
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
                    <TextField
                        className="flex-1"
                        label="Duración Minutos"
                        variant="outlined"
                        type="number"
                        value={item.timeMinutes}
                        slotProps={{
                            htmlInput: {
                                min: 0,
                                step: 1,
                            },
                        }}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const val = parseInt(e.target.value, 10);
                            setItem({ ...item, timeMinutes: isNaN(val) ? 0 : val });
                            setItem({ ...item, time: isNaN(val) ? minutesToTime(0) : minutesToTime(val) });
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