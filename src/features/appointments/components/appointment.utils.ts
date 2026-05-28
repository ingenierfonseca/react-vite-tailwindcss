import type { AppointmentStatus } from "../../../services/appointment/appointment.types"

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

export function getStatusColor(status: AppointmentStatus): string {
    switch (status) {
        case "Confirmed": return "bg-green-100 border-green-300 text-green-800"
        case "Pending": return "bg-amber-100 border-amber-300 text-amber-800"
        case "Cancelled": return "bg-red-100 border-red-300 text-red-800"
        case "Completed": return "bg-blue-100 border-blue-300 text-blue-800"
    }
}

export function getStatusBadgeColor(status: AppointmentStatus): string {
    switch (status) {
        case "Confirmed": return "bg-green-500"
        case "Pending": return "bg-amber-500"
        case "Cancelled": return "bg-red-500"
        case "Completed": return "bg-blue-500"
    }
}
