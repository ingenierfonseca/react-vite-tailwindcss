import { cn, theme } from "../../utils/theme";

interface InputTextAppProps {
    title: string
    value: string
    placeholder: string,
    disabled?: boolean
}
export default function InputTextApp({title, value, placeholder, disabled = false}: InputTextAppProps) {
    return (
        <div className="flex flex-col flex-1">
            <p className={`${cn(theme.labelform)}`}>{title}</p>
            <div className="relative w-full">
                <input type="text" value={value} placeholder={placeholder} className={`${cn(theme.calendar.content)}`} disabled={disabled} />
            </div>
        </div>
    )
}