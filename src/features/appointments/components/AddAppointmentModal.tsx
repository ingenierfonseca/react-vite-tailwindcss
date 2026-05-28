import { useState, useCallback, useEffect } from "react"
import { Search } from "lucide-react"
import { toast } from "react-toastify"
import Modal from "../../../components/commons/Modal"
import TextFieldApp from "../../../components/commons/TextFieldApp"
import DropDownApp from "../../../components/commons/DropDownApp"
import CalendarApp from "../../../components/commons/CalendarApp"
import { CustomerService } from "../../../services/customer/customer.service"
import { DoctorService } from "../../../services/doctor/doctor.service"
import { AppointmentService } from "../../../services/appointment/appointment.service"
import { useCreateAppointment } from "../appointment.hooks"
import type { DropDownAppModel } from "../../../models/dropdownapp.type"
import type { AppointmentStatus } from "../../../services/appointment/appointment.types"

const STATUS_OPTIONS: DropDownAppModel[] = [
    { id: "Confirmed", value: "Confirmada" },
    { id: "Pending", value: "Pendiente" },
    { id: "Cancelled", value: "Cancelada" },
    { id: "Completed", value: "Completada" },
]

interface AddAppointmentModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export default function AddAppointmentModal({ isOpen, onClose, onSuccess }: AddAppointmentModalProps) {
    const { create, loading } = useCreateAppointment()
    const [patientQuery, setPatientQuery] = useState("")
    const [patients, setPatients] = useState<DropDownAppModel[]>([])
    const [selectedPatient, setSelectedPatient] = useState("")
    const [doctors, setDoctors] = useState<DropDownAppModel[]>([])
    const [selectedDoctor, setSelectedDoctor] = useState("")
    const [chairs, setChairs] = useState<DropDownAppModel[]>([])
    const [selectedChair, setSelectedChair] = useState("")
    const [date, setDate] = useState(new Date().toISOString().split("T")[0])
    const [startTime, setStartTime] = useState("09:00")
    const [status, setStatus] = useState("Pending")
    const [notes, setNotes] = useState("")

    const reset = useCallback(() => {
        setPatientQuery("")
        setSelectedPatient("")
        setSelectedDoctor("")
        setSelectedChair("")
        setDate(new Date().toISOString().split("T")[0])
        setStartTime("09:00")
        setStatus("Pending")
        setNotes("")
    }, [])

    const loadPatients = useCallback(async (search: string) => {
        try {
            const res = await CustomerService.get({ page: 1, search })
            const items = res.data.map((c) => ({ id: c.id, value: `${c.firstName} ${c.lastName}` }))
            setPatients(items)
        } catch { }
    }, [])

    const loadDoctors = useCallback(async () => {
        try {
            const res = await DoctorService.get({ page: 1, search: "" })
            const items = res.data.map((d) => ({ id: d.id, value: `${d.firstName} ${d.lastName}` }))
            setDoctors(items)
        } catch { }
    }, [])

    const loadChairs = useCallback(async () => {
        try {
            const data = await AppointmentService.getChairs()
            const items = data.map((c) => ({ id: c.id, value: c.name }))
            setChairs(items)
        } catch {
            setChairs([{ id: 1, value: "Silla 1" }, { id: 2, value: "Silla 2" }])
        }
    }, [])

    useEffect(() => {
        if (isOpen) {
            loadPatients("")
            loadDoctors()
            loadChairs()
        }
    }, [isOpen, loadPatients, loadDoctors, loadChairs])

    const handleSubmit = async () => {
        if (!selectedPatient) { toast.error("Selecciona un paciente"); return }
        if (!selectedDoctor) { toast.error("Selecciona un doctor"); return }
        if (!selectedChair) { toast.error("Selecciona una silla"); return }
        if (!date) { toast.error("Selecciona una fecha"); return }
        if (!startTime) { toast.error("Selecciona una hora"); return }

        const endHour = parseInt(startTime.split(":")[0]) + 1
        const endMin = startTime.split(":")[1]
        const endTime = `${String(endHour).padStart(2, "0")}:${endMin}`

        const result = await create({
            patientId: Number(selectedPatient),
            doctorId: Number(selectedDoctor),
            chairId: Number(selectedChair),
            date,
            startTime,
            endTime,
            status: status as AppointmentStatus,
            notes: notes || undefined,
        })

        if (result.success) {
            toast.success("Cita creada exitosamente")
            reset()
            onSuccess()
        } else {
            toast.error("Error al crear la cita")
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => { reset(); onClose() }}
            title="Nueva Cita"
            textBtnConfirm={loading ? "Guardando..." : "Agendar Cita"}
            clickBtnConfirm={handleSubmit}
        >
            <div className="space-y-4">
                <p className="text-sm text-slate-500 dark:text-slate-400">Completa los datos para agendar una nueva cita</p>
                <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-xl">
                    <div className="md:col-span-2">
                        <p className="text-xs font-semibold text-slate-500 mb-1">Paciente</p>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Buscar paciente..."
                                value={patientQuery}
                                onChange={(e) => { setPatientQuery(e.target.value); loadPatients(e.target.value) }}
                                className="w-full pl-9 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                        {patients.length > 0 && (
                            <select
                                size={4}
                                value={selectedPatient}
                                onChange={(e) => setSelectedPatient(e.target.value)}
                                className="w-full mt-1 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none"
                            >
                                {patients.map((p) => (
                                    <option key={p.id} value={p.id} className="p-1">{p.value}</option>
                                ))}
                            </select>
                        )}
                    </div>

                    <DropDownApp title="Doctor" data={doctors} value={selectedDoctor} onChange={setSelectedDoctor} />
                    <DropDownApp title="Silla" data={chairs} value={selectedChair} onChange={setSelectedChair} />

                    <CalendarApp title="Fecha" value={date} onChange={setDate} />

                    <div className="flex flex-col flex-1">
                        <p className="font-bold p-1 text-xs text-black">Hora de inicio</p>
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full px-3 py-2 appearance-none border border-slate-300 bg-white/80 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>

                    <DropDownApp title="Estado" data={STATUS_OPTIONS} value={status} onChange={setStatus} />

                    <div className="md:col-span-2">
                        <TextFieldApp
                            label="Notas (opcional)"
                            value={notes}
                            className="w-full"
                            onChange={setNotes}
                        />
                    </div>
                </fieldset>
            </div>
        </Modal>
    )
}
