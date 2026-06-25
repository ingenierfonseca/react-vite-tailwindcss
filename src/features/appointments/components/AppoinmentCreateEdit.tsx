import { useEffect, useMemo } from "react"
import { useAppointmentForm } from "../appointment.hooks"
import { AppointmentStatus, type Appointment } from "@/models/appointment.types"
import { PaginatedAutocomplete } from "@/components/pagination-data/PaginatedAutocomplete"
import { CustomerService } from "@/services/customer/customer.service"
import { DoctorService } from "@/services/doctor/doctor.service"
import { AppointmentTypeService } from "@/services/appointment-type/appointmentType.service"
import { DatePicker, TimePicker } from "@mui/x-date-pickers"
import dayjs from "dayjs"
import ButtonSaveApp from "@/components/commons/ButtonSaveApp"
import { ResourceService } from "@/services/resource/resource.service"
import { AppointmentStatusService } from "@/services/appointment-status/appointmentStatus.service"
import { Checkbox, FormControlLabel, TextField } from "@mui/material"
import PageRightComponent from "@/components/commons/PageRightComponent"
import { Calendar } from "lucide-react"

interface AppointmentCreateProps {
    itemParam?: Partial<Appointment>
    setIsOpen: (value: boolean) => void
    refetch: () => void
}
const TERMINAL_STATUSES: number[] = [AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW]

export default function AppointmentCreate({ itemParam, setIsOpen, refetch }: AppointmentCreateProps) {
    const {
        appointment,
        updateAppointment,
        setAppointment,
        save,
        loading,
        lastStatusId,
        setLastStatusId,
    } = useAppointmentForm()

    const isReadOnly = useMemo(
        () => !!(appointment.id && appointment.id > 0 &&
            appointment.statusId &&
            TERMINAL_STATUSES.includes(appointment.statusId) &&
            appointment.statusId === lastStatusId),
        [appointment.id, appointment.statusId, lastStatusId]
    )

    useEffect(() => {
        if (itemParam) {
            setLastStatusId(itemParam.statusId ?? null)
            setAppointment(itemParam)
        } else {
            setLastStatusId(null)
            setAppointment({
                id: 0,
                customerId: 0,
                doctorId: 0,
                date: dayjs().format("YYYY-MM-DD"),
                startTime: dayjs().format("HH:mm:ss"),
                appointmentTypeId: 0,
                statusId: 0,
            })
        }
    }, [itemParam])

    const handleSave = async () => {
        const response = await save()
        if (response) {
            refetch()
            setIsOpen(false)
        }
    }

    return (
        <PageRightComponent
             title={appointment && appointment.id ? 'Editar Cita' : 'Nueva Cita'}
             icon={
                <div className="p-2 bg-primary/5 text-primary rounded-lg">
                    <Calendar />
                </div>
            }
            onClick={() => setIsOpen(false)}
        >
            <div className="flex flex-col md:flex-row gap-8 mt-4">
                <PaginatedAutocomplete
                    label="Paciente"
                    value={appointment ? appointment.customerId : undefined}
                    onChange={(value) =>
                        updateAppointment("customerId", value)
                    }
                    disabled={isReadOnly}
                    fetchData={CustomerService.get}
                    getValue={(item) => item.id}
                    getLabel={(item) => `${item.firstName.trim()} ${item.lastName.trim()}`}
                />
                <PaginatedAutocomplete
                    label="Doctor"
                    value={appointment ? appointment.doctorId : undefined}
                    onChange={(value) => updateAppointment("doctorId", value)}
                    disabled={isReadOnly}
                    fetchData={DoctorService.get}
                    getValue={(item) => item.id}
                    getLabel={(item) => `${item.firstName.trim()} ${item.lastName.trim()}`}
                />
            </div>

            <div className="flex flex-col md:flex-row gap-8 mt-4">
                <PaginatedAutocomplete
                    label="Tipo de Cita"
                    value={appointment ? appointment.appointmentTypeId : undefined}
                    onChange={(value) =>
                        updateAppointment("appointmentTypeId", value)
                    }
                    disabled={isReadOnly}
                    fetchData={AppointmentTypeService.get}

                    getValue={(item) => item.id}
                    getLabel={(item) => `${item.name}`}
                />
                <PaginatedAutocomplete
                    label="Recurso"
                    value={appointment ? appointment.resourceId : undefined}
                    onChange={(value) =>
                        updateAppointment("resourceId", value)
                    }
                    disabled={isReadOnly}
                    fetchData={ResourceService.get}
                    getValue={(item) => item.id}
                    getLabel={(item) => `${item.name}`}
                />
            </div>
            <div className="flex flex-col md:flex-row gap-8 mt-4">
                <DatePicker
                    className="flex-1"
                    label="Fecha"
                    value={appointment?.date ? dayjs(appointment.date) : null}
                    onChange={(val) => updateAppointment("date", val ? val.format("YYYY-MM-DD") : null)}
                    disabled={isReadOnly}
                />
                <TimePicker
                    className="flex-1"
                    label="Hora de Inicio"
                    value={
                        appointment?.startTime
                            ? dayjs(appointment.startTime, 'HH:mm')
                            : null
                    }
                    onChange={(val) => updateAppointment("startTime", val ? val.format("HH:mm:ss") : null)}
                    disabled={isReadOnly}
                />
            </div>

            {
        appointment && appointment.id !== 0 &&
        <div className="flex flex-col md:flex-row gap-8 mt-4">
            <PaginatedAutocomplete
                label="Estado de Cita"
                value={appointment ? appointment.statusId : undefined}
                onChange={(value) =>
                    updateAppointment("statusId", value)
                }
                disabled={isReadOnly}
                fetchData={AppointmentStatusService.get}
                getValue={(item) => item.id}
                getLabel={(item) => `${item.name}`}
            />
            <FormControlLabel
                label="Confirmar Cita"
                className="flex-1 dark:text-slate-400"
                disabled={isReadOnly}
                control={
                    <Checkbox className="dark:text-primary-dark!"
                        checked={appointment.isConfirmed}
                        onChange={(e) => updateAppointment("isConfirmed", e.target.checked)}
                        disabled={isReadOnly}
                    />
                }
            />
        </div>
    }
    <div className="flex flex-col md:flex-row gap-8 mt-4">
        <TextField
            className="w-full"
            label="Notas"
            multiline
            rows={4}
            value={appointment.notes ?? ""}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                if (e.target.value.length <= 300) {
                    updateAppointment("notes", e.target.value)
                }
            }}
            disabled={isReadOnly}
            helperText={`${appointment.notes?.length || 0}/${300}`}
            slotProps={{
                input: {
                    inputProps: {
                        maxLength: 300,
                    },
                },
            }}
        />
    </div>
    {
        appointment && appointment.statusId === AppointmentStatus.CANCELLED &&
        <TextField
            className="w-full"
            label="Motivo cancelación"
            multiline
            rows={2}
            value={appointment.cancellationReason ?? ""}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                if (e.target.value.length <= 100) {
                    updateAppointment("cancellationReason", e.target.value)
                }
            }}
            disabled={isReadOnly}
            helperText={`${appointment.cancellationReason?.length || 0}/${100}`}
            slotProps={{
                input: {
                    inputProps: {
                        maxLength: 100,
                    },
                },
            }}
        />
    }

    {
        !isReadOnly &&
        <div className="flex justify-center">
            <ButtonSaveApp
                className="flex-6"
                label="Cita"
                onClick={() => handleSave()}
                loading={loading}
            />
        </div>
    }
        </PageRightComponent >
    )
}