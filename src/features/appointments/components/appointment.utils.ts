import { AppointmentStatus } from "@/models/appointment.types";

export type ViewMode = "day" | "week" | "month"

/*export const TIME_SLOTS = Array.from({ length: 22 }, (_, i) => {
    const hour = 8 + Math.floor(i / 2)
    const minute = i % 2 === 0 ? "00" : "30"
    return `${String(hour).padStart(2, "0")}:${minute}`
})*/

export const TIME_SLOTS = Array.from({ length: 11 }, (_, i) => {
    const hour = 8 + i
    return `${String(hour).padStart(2, "0")}:00`
})

export function getDateRange(view: ViewMode, cursor: Date): { start: Date; end: Date } {
    const d = new Date(cursor)
    if (view === "day") {
        return { start: new Date(d), end: new Date(d) }
    }
    if (view === "week") {
        const day = d.getDay()
        const start = new Date(d)
        start.setDate(d.getDate() - day)
        const end = new Date(start)
        end.setDate(start.getDate() + 6)
        return { start, end }
    }
    const start = new Date(d.getFullYear(), d.getMonth(), 1)
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0)
    return { start, end }
}

export function formatCursorLabel(view: ViewMode, cursor: Date): string {
    if (view === "day") return formatDateHeader(cursor)
    if (view === "week") {
        const { start, end } = getDateRange("week", cursor)
        return `${start.toLocaleDateString("es-ES", { day: "numeric", month: "short" })} - ${end.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}`
    }
    return cursor.toLocaleDateString("es-ES", { month: "long", year: "numeric" })
}

function formatDateHeader(d: Date): string {
    return d.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
}

export function getStatusColor(statusId: number): string {
    switch (statusId) {
        case AppointmentStatus.CONFIRMED: return "bg-green-100 border-green-300 text-green-800"
        case AppointmentStatus.PENDING: return "bg-amber-100 border-amber-300 text-amber-800"
        case AppointmentStatus.CANCELLED: return "bg-red-100 border-red-300 text-red-800"
        case AppointmentStatus.COMPLETED: return "bg-blue-100 border-blue-300 text-blue-800"
        case AppointmentStatus.NO_SHOW: return "bg-gray-100 border-gray-300 text-gray-800"
        case AppointmentStatus.RESCHEDULED: return "bg-purple-100 border-purple-300 text-purple-800"
        default: return "bg-slate-100 border-slate-300 text-slate-800"
    }
}

export function getStatusBadgeColor(statusId: number): string {
    switch (statusId) {
        case AppointmentStatus.CONFIRMED: return "bg-green-500"
        case AppointmentStatus.PENDING: return "bg-amber-500"
        case AppointmentStatus.CANCELLED: return "bg-red-500"
        case AppointmentStatus.COMPLETED: return "bg-blue-500"
        case AppointmentStatus.NO_SHOW: return "bg-gray-500"
        case AppointmentStatus.RESCHEDULED: return "bg-purple-500"
        default: return "bg-slate-500"
    }
}
