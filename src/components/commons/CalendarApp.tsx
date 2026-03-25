import { Calendar } from "lucide-react";
import { cn, theme } from "../../utils/theme";

interface CalendarAppProps {
    title: string
}
export default function CalendarApp({title}: CalendarAppProps) {
    return (
        <div className="flex flex-col flex-1">
            <p className={`${cn(theme.labelform)}`}>{title}</p>
            <div className="relative w-full">
                <input type="date" className={`${cn(theme.calendar.content)}`} />
                <div className="pointer-events-none absolute inset-y-0 right-5 flex items-center">
                    <Calendar className="w-4 h-4" />
                </div>
            </div>
        </div>
    )
}