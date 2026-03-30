import { cn, theme } from "../../utils/theme";

interface InputTextAppProps {
    title: string
    value: string
    placeholder: string,
    disabled?: boolean,
    onChange?: (value: string) => void
}
export default function InputTextApp({title, value, placeholder, onChange, disabled = false}: InputTextAppProps) {
    return (
        <div className="flex flex-col flex-1">
            <p className={`${cn(theme.labelform)}`}>{title}</p>
            <div className="relative w-full">
                <input type="text" value={value} placeholder={placeholder} className={`${cn(theme.calendar.content)}`} disabled={disabled} onChange={(e) => onChange && onChange(e.target.value)} />
            </div>
        </div>
    )
}