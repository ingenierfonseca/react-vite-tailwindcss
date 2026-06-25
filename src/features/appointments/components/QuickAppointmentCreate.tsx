import { useEffect } from "react"
import Modal from "../../../components/commons/Modal"
import TextFieldApp from "../../../components/commons/TextFieldApp"
import type { Customer } from "../../../services/customer/customer.type"
import { useAppointmentForm } from "../appointment.hooks"
import { PaginatedAutocomplete } from "../../../components/pagination-data/PaginatedAutocomplete"
import { DoctorService } from "../../../services/doctor/doctor.service"
import { AppointmentTypeService } from "../../../services/appointment-type/appointmentType.service"
import { DatePicker, TimePicker } from "@mui/x-date-pickers"
import dayjs from "dayjs"
import { ResourceService } from "../../../services/resource/resource.service"
import { TextField } from "@mui/material"

interface QuickAppointmentCreateProps {
    customer: Customer
    isOpen: boolean
    setIsOpen: (value: boolean) => void
    onSuccess?: () => void
}

export default function QuickAppointmentCreate({ customer, isOpen, setIsOpen, onSuccess }: QuickAppointmentCreateProps) {
    const {
        appointment,
        updateAppointment,
        setAppointment,
        save,
        loading,
    } = useAppointmentForm()

    useEffect(() => {
        if (isOpen) {
            setAppointment({
                id: 0,
                customerId: customer.id,
                date: dayjs().format("YYYY-MM-DD"),
                startTime: dayjs().format("HH:mm:ss"),
                appointmentTypeId: 0,
                doctorId: 0,
                resourceId: 0,
                statusId: 0,
            })
        }
    }, [isOpen, customer.id, setAppointment])

    async function handleSave() {
        const result = await save()
        if (result) {
            onSuccess?.()
            setIsOpen(false)
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title="Agendar Cita"
            textBtnConfirm="Agendar Cita"
            clickBtnConfirm={handleSave}
            disabled={loading}
        >
            <div className="space-y-4">
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Completa los datos de la cita
                </p>
                <fieldset className="grid p-2 gap-2 border border-slate-200 dark:border-slate-700">
                    <TextFieldApp
                        label="Paciente"
                        value={`${customer.firstName} ${customer.lastName}`}
                        className="md:flex-2 px-2 text-sm"
                        disabled={true}
                        onChange={() => {}}
                    />

                    <PaginatedAutocomplete
                        label="Doctor"
                        value={appointment.doctorId}
                        onChange={(value) => updateAppointment("doctorId", value)}
                        fetchData={DoctorService.get}
                        getValue={(item) => item.id}
                        getLabel={(item) => `${item.firstName.trim()} ${item.lastName.trim()}`}
                    />

                    <div className="flex flex-col md:flex-row gap-2">
                        <PaginatedAutocomplete
                            label="Tipo de Cita"
                            value={appointment.appointmentTypeId}
                            onChange={(value) => updateAppointment("appointmentTypeId", value)}
                            fetchData={AppointmentTypeService.get}
                            getValue={(item) => item.id}
                            getLabel={(item) => `${item.name}`}
                        />
                        <PaginatedAutocomplete
                            label="Recurso"
                            value={appointment.resourceId}
                            onChange={(value) => updateAppointment("resourceId", value)}
                            fetchData={ResourceService.get}
                            getValue={(item) => item.id}
                            getLabel={(item) => `${item.name}`}
                        />
                    </div>

                    <div className="flex flex-col md:flex-row gap-2">
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

                    <TextField
                        label="Notas"
                        multiline
                        rows={3}
                        value={appointment.notes ?? ""}
                        onChange={(e) => {
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
                </fieldset>
            </div>
        </Modal>
    )
}
