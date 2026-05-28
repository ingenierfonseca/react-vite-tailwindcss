import { Loader2 } from "lucide-react"
import type { Appointment } from "../../../services/appointment/appointment.types"
import { TIME_SLOTS, getStatusColor } from "./appointment.utils"

interface ScheduleGridProps {
    days: Date[]
    appointmentsBySlot: Map<string, Appointment[]>
    loading: boolean
}

function timeToMinutes(time: string): number {
    const [h, m] = time.split(":").map(Number)
    return h * 60 + m
}

function findSlot(time: string): string {
    const min = timeToMinutes(time)
    for (const slot of TIME_SLOTS) {
        const s = timeToMinutes(slot)
        if (min >= s && min < s + 60) return slot
    }
    return TIME_SLOTS[0]
}

function calcRowSpan(startTime: string, endTime: string, slot: string): number {
    if (startTime !== slot) return 1
    const endMin = timeToMinutes(endTime)
    let started = false
    let count = 0
    for (const s of TIME_SLOTS) {
        if (s === slot) started = true
        if (!started) continue
        const sm = timeToMinutes(s)
        if (sm < endMin) count++
        else break
    }
    return Math.max(1, count)
}

export default function ScheduleGrid({ days, appointmentsBySlot, loading }: ScheduleGridProps) {
    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        )
    }

    const chairIds = new Set<number>()
    const chairNames = new Map<number, string>()
    for (const appts of appointmentsBySlot.values()) {
        for (const a of appts) {
            chairIds.add(a.chairId)
            chairNames.set(a.chairId, a.chairName)
        }
    }
    const chairs = chairIds.size > 0
        ? Array.from(chairIds).map(id => ({ id, name: chairNames.get(id) ?? `Silla ${id}` }))
        : [{ id: 1, name: "Silla 1" }, { id: 2, name: "Silla 2" }]

    type CellAction = { skip: boolean; appointment?: Appointment; rowSpan?: number }

    const slotMappedAppts = new Map<string, Appointment[]>()
    for (const appts of appointmentsBySlot.values()) {
        for (const a of appts) {
            const slot = findSlot(a.startTime)
            const k = `${a.date}_${slot}`
            if (!slotMappedAppts.has(k)) slotMappedAppts.set(k, [])
            slotMappedAppts.get(k)!.push(a)
        }
    }

    const cellMap = new Map<string, CellAction>()

    for (let dayIdx = 0; dayIdx < days.length; dayIdx++) {
        const dateStr = days[dayIdx].toISOString().split("T")[0]
        const activeUntil: Map<number, number> = new Map()

        for (let slotIdx = 0; slotIdx < TIME_SLOTS.length; slotIdx++) {
            const time = TIME_SLOTS[slotIdx]

            for (const chair of chairs) {
                const key = `${dateStr}_${chair.id}_${slotIdx}`
                const activeEnd = activeUntil.get(chair.id) ?? -1

                if (slotIdx <= activeEnd) {
                    cellMap.set(key, { skip: true })
                    continue
                }

                const lookupKey = `${dateStr}_${time}`
                const cellAppts = (slotMappedAppts.get(lookupKey) ?? [])
                    .filter(a => a.chairId === chair.id)

                if (cellAppts.length === 0) {
                    cellMap.set(key, { skip: false })
                    continue
                }

                const appt = cellAppts[0]
                const rowSpan = calcRowSpan(appt.startTime, appt.endTime, time)

                if (rowSpan > 1) {
                    activeUntil.set(chair.id, slotIdx + rowSpan - 1)
                }

                cellMap.set(key, { skip: false, appointment: appt, rowSpan })
            }
        }
    }

    return (
        <table className="table-fixed w-full min-w-150 border-collapse">
            <thead>
                <tr>
                    <th className="sticky left-0 z-10 bg-white dark:bg-slate-800 border-b border-r border-slate-200 dark:border-slate-700 p-2" />
                    {days.map((day) => (
                        <th key={day.toISOString()} colSpan={chairs.length}
                            className="border-b border-slate-200 dark:border-slate-700 p-2 text-center"
                        >
                            <span className="font-semibold text-slate-500 dark:text-slate-400">
                                {day.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" })}
                            </span>
                        </th>
                    ))}
                </tr>
                <tr>
                    <th className="sticky left-0 z-10 bg-white dark:bg-slate-800 border-b border-r border-slate-200 dark:border-slate-700 text-center font-medium text-slate-500 dark:text-slate-400" >
                        Hora
                    </th>
                    {days.map((day) =>
                        chairs.map((chair) => (
                            <th key={`${day.toISOString()}_${chair.id}`}
                                className="border-b border-r border-slate-200 dark:border-slate-700 p-3 text-center font-medium text-slate-500 dark:text-slate-400"
                            >
                                {chair.name}
                            </th>
                        ))
                    )}
                </tr>
            </thead>
            <tbody>
                {TIME_SLOTS.map((time, slotIdx) => {
                    const cells: React.ReactNode[] = []

                    cells.push(
                        <td key="time"
                            className="sticky left-0 z-10 bg-white dark:bg-slate-800 border-b border-r border-slate-200 dark:border-slate-700 p-3 text-sm text-slate-400 text-center"
                        >
                            <div className="min-h-15 flex items-center justify-center">{time}</div>
                        </td>
                    )

                    for (let dayIdx = 0; dayIdx < days.length; dayIdx++) {
                        const dateStr = days[dayIdx].toISOString().split("T")[0]
                        for (const chair of chairs) {
                            const key = `${dateStr}_${chair.id}_${slotIdx}`
                            const cell = cellMap.get(key)

                            if (cell?.skip) continue

                            const cellKey = `${dateStr}_${chair.id}_${time}`

                            if (cell?.appointment) {
                                const appt = cell.appointment
                                cells.push(
                                    <td key={appt.id} rowSpan={cell.rowSpan}
                                        className="border-b border-r border-slate-100 dark:border-slate-700/50 p-1 align-top"
                                    >
                                        <div
                                            className={`p-3 rounded-lg border text-sm leading-tight cursor-pointer hover:shadow-md transition ${getStatusColor(appt.status)}`}
                                            title={`${appt.patientFullName} - ${appt.doctorName}`}
                                        >
                                            <p className="font-semibold truncate">{appt.patientFullName}</p>
                                            <p className="truncate">{appt.appointmentType.name}</p>
                                            <p className="truncate opacity-75">{appt.doctorName}</p>
                                        </div>
                                    </td>
                                )
                            } else {
                                cells.push(
                                    <td key={cellKey}
                                        className="border-b border-r border-slate-100 dark:border-slate-700/50 p-1 align-top min-h-15 h-15"
                                    />
                                )
                            }
                        }
                    }

                    return <tr key={time}>{cells}</tr>
                })}
            </tbody>
        </table>
    )
}
