import { useState, useMemo, useCallback } from "react"
import {
    Calendar,
    CalendarCheck,
    CalendarX,
    Clock,
    ChevronLeft,
    ChevronRight,
} from "lucide-react"
import PageComponent from "../../components/commons/PageComponent"
import { useAppointmentStats, useAppointmentSchedule } from "./appointment.hooks"
import type { Appointment, AppointmentInfoDto } from "../../models/appointment.types"
import StatCard from "./components/StatCard"
import ScheduleGrid from "./components/ScheduleGrid"
import MonthView from "./components/MonthView"
import { getDateRange, formatCursorLabel, type ViewMode } from "./components/appointment.utils"
import AppointmentCreate from "./components/AppoinmentCreateEdit"

export default function AppointmentList() {
    const [view, setView] = useState<ViewMode>("day")
    const [cursor, setCursor] = useState(new Date())
    const [selectedAppointment, setSelectedAppointment] = useState<Partial<Appointment> | null>(null)
    const [isOpenCreateAppointment, setIsOpenCreateAppointment] = useState(false)

    const dateRange = useMemo(() => getDateRange(view, cursor), [view, cursor])

    const filters = useMemo(() => ({
        startDate: dateRange.start.toISOString().split("T")[0],
        endDate: dateRange.end.toISOString().split("T")[0],
    }), [dateRange])

    const { stats, loading: statsLoading, refetch: refetchStats } = useAppointmentStats(filters)
    const { appointments, loading: scheduleLoading, refetch: refetchSchedule, openTransition, setOpenTransition } = useAppointmentSchedule(filters)

    const navigate = useCallback((dir: -1 | 1) => {
        const d = new Date(cursor)
        if (view === "day") d.setDate(d.getDate() + dir)
        else if (view === "week") d.setDate(d.getDate() + 7 * dir)
        else d.setMonth(d.getMonth() + dir)
        setCursor(d)
    }, [cursor, view])

    const scheduleGrid = useMemo(() => {
        if (view === "month") return null

        const days: Date[] = []
        if (view === "day") {
            days.push(new Date(dateRange.start))
        } else {
            const d = new Date(dateRange.start)
            while (d <= dateRange.end) {
                days.push(new Date(d))
                d.setDate(d.getDate() + 1)
            }
        }
        return { days }
    }, [view, dateRange])

    const handleAppointmentClick = useCallback((appt: any) => {
        setSelectedAppointment({
            id: appt.id,
            customerId: appt.customerId,
            patientFullName: appt.patientName ?? appt.patientFullName ?? '',
            doctorId: appt.doctorId,
            doctorName: appt.doctorName ?? '',
            resourceId: appt.resourceId,
            resourceName: appt.resourceName ?? '',
            date: appt.date,
            startTime: appt.startTime,
            endTime: appt.endTime,
            statusId: appt.statusId,
            notes: appt.notes,
            appointmentTypeId: appt.appointmentTypeId,
            isConfirmed: appt.isConfirmed ?? false,
        })
        openCreateAppointment(true)
    }, [])

    const appointmentsBySlot = useMemo(() => {
        const map = new Map<string, AppointmentInfoDto[]>()
        for (const appt of appointments) {
            const key = `${appt.date}_${appt.startTime}`
            if (!map.has(key)) map.set(key, [])
            map.get(key)!.push(appt)
        }
        return map
    }, [appointments])

    function openCreateAppointment(value: boolean) {
        if (value) {
            setOpenTransition(value)
            setIsOpenCreateAppointment(value)
        } else {
            setOpenTransition(false)
            setTimeout(() => {
                setIsOpenCreateAppointment(false)
            }, 500);
        }
    }

    return (
        <PageComponent
            title="Agenda de Citas"
            description="Gestiona las citas de tus pacientes"
            textButton="Nueva Cita"
            onclick={() => { setSelectedAppointment(null); openCreateAppointment(true); }}
        >

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard icon={<Calendar size={20} />} label="Total de Citas" value={stats?.total ?? 0} color="text-blue-600 bg-blue-50 dark:bg-blue-900/20" />
                <StatCard icon={<CalendarCheck size={20} />} label="Confirmadas" value={stats?.confirmed ?? 0} color="text-green-600 bg-green-50 dark:bg-green-900/20" />
                <StatCard icon={<Clock size={20} />} label="Pendientes" value={stats?.pending ?? 0} color="text-amber-600 bg-amber-50 dark:bg-amber-900/20" />
                <StatCard icon={<CalendarX size={20} />} label="Canceladas" value={stats?.cancelled ?? 0} color="text-red-600 bg-red-50 dark:bg-red-900/20" />
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mt-6">
                <div className="flex flex-wrap items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-0.5">
                        {(["day", "week", "month"] as ViewMode[]).map((m) => (
                            <button
                                key={m}
                                onClick={() => setView(m)}
                                className={`px-4 py-2 text-xs font-semibold rounded-xl transition ${view === m
                                        ? "bg-primary text-white dark:bg-slate-600 shadow-sm"
                                        : "text-slate-800 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                                    }`}
                            >
                                {m === "day" ? "Día" : m === "week" ? "Semana" : "Mes"}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                        <button onClick={() => navigate(-1)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition">
                            <ChevronLeft size={18} />
                        </button>
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 min-w-45 text-center">
                            {formatCursorLabel(view, cursor)}
                        </span>
                        <button onClick={() => navigate(1)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition">
                            <ChevronRight size={18} />
                        </button>
                    </div>

                    <button
                        onClick={() => setCursor(new Date())}
                        className="px-3 py-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition"
                    >
                        Hoy
                    </button>
                </div>

                <div className="overflow-x-auto">
                    {view === "month" ? (
                        <MonthView cursor={cursor} appointments={appointments} onDateClick={(d) => { setCursor(d); setView("day") }} onAppointmentClick={handleAppointmentClick} />
                    ) : (
                        <ScheduleGrid days={scheduleGrid!.days} appointmentsBySlot={appointmentsBySlot} loading={scheduleLoading} onAppointmentClick={handleAppointmentClick} />
                    )}
                </div>
            </div>

            <div
                className={`fixed top-0 right-0 h-full md:w-7/12 bg-white dark:bg-slate-800 shadow-2xl z-50 
                                transform transition-transform duration-500 ease-in-out 
                                ${openTransition ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {isOpenCreateAppointment && <AppointmentCreate setIsOpen={(v) => { setOpenTransition(v); if (!v) setSelectedAppointment(null) }} itemParam={selectedAppointment ?? undefined} refetch={() => { refetchSchedule(); refetchStats() }} />}
            </div>
        </PageComponent>
    )
}
