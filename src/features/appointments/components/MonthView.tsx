import type { Appointment } from "../../../models/appointment.types"
import { getStatusColor, getStatusBadgeColor } from "./appointment.utils"

interface MonthViewProps {
    cursor: Date
    appointments: Appointment[]
    onDateClick: (d: Date) => void
    onAppointmentClick?: (appointment: Appointment) => void
}

export default function MonthView({ cursor, appointments, onDateClick, onAppointmentClick }: MonthViewProps) {
    const year = cursor.getFullYear()
    const month = cursor.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const appointmentsByDate = new Map<string, Appointment[]>()
    for (const a of appointments) {
        if (!appointmentsByDate.has(a.date)) appointmentsByDate.set(a.date, [])
        appointmentsByDate.get(a.date)!.push(a)
    }

    const cells: (number | null)[] = []
    for (let i = 0; i < firstDay; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)

    return (
        <div className="p-4">
            <div className="grid grid-cols-7 mb-2">
                {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((d) => (
                    <div key={d} className="text-center text-xs font-semibold text-slate-400 py-1">{d}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden">
                {cells.map((day, i) => {
                    if (day === null) return <div key={`e-${i}`} className="bg-slate-50 dark:bg-slate-800/50 min-h-20" />
                    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                    const dayAppts = appointmentsByDate.get(dateStr) ?? []
                    return (
                        <button
                            key={dateStr}
                            onClick={() => onDateClick(new Date(year, month, day))}
                            className="bg-white dark:bg-slate-800 min-h-20 p-1.5 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition text-xs"
                        >
                            <span className="font-semibold text-slate-600 dark:text-slate-300">{day}</span>
                            <div className="mt-1 space-y-0.5">
                                {dayAppts.slice(0, 3).map((a) => (
                                    <div
                                        key={a.id}
                                        className={`flex items-center gap-1 rounded px-1 py-0.5 cursor-pointer hover:opacity-80 transition ${getStatusColor(a.status)}`}
                                        onClick={(e) => { e.stopPropagation(); onAppointmentClick?.(a); }}
                                    >
                                        <span className={`w-1.5 h-1.5 rounded-full ${getStatusBadgeColor(a.status)}`} />
                                        <span className="truncate">{a.patientFullName}</span>
                                    </div>
                                ))}
                                {dayAppts.length > 3 && (
                                    <span className="text-slate-400">+{dayAppts.length - 3} más</span>
                                )}
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
