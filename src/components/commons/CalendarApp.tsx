import { Calendar } from "lucide-react";
import { cn, theme } from "../../utils/theme";
import { formatDateToYYYYMMDD } from "../../utils/date.util";

interface CalendarAppProps {
    title: string,
    value: string,
    onChange: (value: string) => void
}
export default function CalendarApp({title, value, onChange}: CalendarAppProps) {
    return (
        <div className="flex flex-col flex-1">
            <p className={`${cn(theme.labelform)}`}>{title}</p>
            <div className="relative w-full">
                <input type="date" value={formatDateToYYYYMMDD(value)}
                    onChange={(e) => onChange(e.target.value)}
                    className={`${cn(theme.calendar.content)}`} />
                <div className="pointer-events-none absolute inset-y-0 right-5 flex items-center">
                    <Calendar className="w-4 h-4" />
                </div>
            </div>
        </div>
    )
}