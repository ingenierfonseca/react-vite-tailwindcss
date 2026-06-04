import { useEffect } from "react"
import { useCreateAppointment } from "../appointment.hooks"
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

interface AppointmentCreateProps {
    itemParam?: Partial<Appointment>
    setIsOpen: (value: boolean) => void
    refetch: () => void
}
export default function AppointmentCreate({ itemParam, setIsOpen, refetch }: AppointmentCreateProps) {
    const {
        appointment,
        updateAppointment,
        setAppointment,
        create,
        loading,
    } = useCreateAppointment()

    useEffect(() => {
        if (itemParam) {
            setAppointment(itemParam)
        } else {
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
        const response = await create()
        if (response) {
            refetch()
            setIsOpen(false)
        }
    }

    return (
        <div className="w-full/2 h-screen py-5 px-4 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex">
                <p className="font-semibold text-black dark:text-white">{appointment && appointment.id ? 'Editar Cita' : 'Nueva Cita'}</p>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-slate-500 hover:text-red-500 text-2xl ml-auto"
                >
                    &times;
                </button>
            </div>
            <div className="flex flex-col md:flex-row gap-8 mt-4">
                <PaginatedAutocomplete
                    label="Paciente"
                    value={appointment ? appointment.customerId : undefined}
                    onChange={(value) =>
                        updateAppointment("customerId", value)
                    }
                    fetchData={CustomerService.get}
                    getValue={(item) => item.id}
                    getLabel={(item) => `${item.firstName.trim()} ${item.lastName.trim()}`}
                />
                <PaginatedAutocomplete
                    label="Doctor"
                    value={appointment ? appointment.doctorId : undefined}
                    onChange={(value) => updateAppointment("doctorId", value)}
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
                />
            </div>

            {appointment && appointment.id !== 0 &&
                <div className="flex flex-col md:flex-row gap-8 mt-4">
                    <PaginatedAutocomplete
                        label="Estado de Cita"
                        value={appointment ? appointment.statusId : undefined}
                        onChange={(value) =>
                            updateAppointment("statusId", value)
                        }
                        fetchData={AppointmentStatusService.get}
                        getValue={(item) => item.id}
                        getLabel={(item) => `${item.name}`}
                    />
                    <FormControlLabel
                        label="Confirmar Cita"
                        className="flex-1 dark:text-slate-400"
                        control={
                            <Checkbox className="dark:text-primary-dark!"
                                checked={appointment.isConfirmed}
                                onChange={(e) => updateAppointment("isConfirmed", e.target.checked)}
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
            {appointment && appointment.statusId === AppointmentStatus.CANCELLED &&
                <TextField
                    className="w-full"
                    label="Motivo cancelación"
                    multiline
                    rows={2}
                    value={appointment.notes ?? ""}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        if (e.target.value.length <= 100) {
                            updateAppointment("notes", e.target.value)
                        }
                    }}
                    helperText={`${appointment.notes?.length || 0}/${100}`}
                    slotProps={{
                        input: {
                            inputProps: {
                                maxLength: 100,
                            },
                        },
                    }}
                />
            }

            <div className="flex justify-center">
                <ButtonSaveApp
                    className="flex-6"
                    label="Cita"
                    onClick={() => handleSave()}
                    loading={loading}
                />
            </div>
        </div>
    )
}