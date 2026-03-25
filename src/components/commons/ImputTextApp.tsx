import { cn, theme } from "../../utils/theme";

interface InputTextAppProps {
    title: string
    placeholder: string
}
export default function InputTextApp({title, placeholder}: InputTextAppProps) {
    return (
        <div className="flex flex-col flex-1">
            <p className={`${cn(theme.labelform)}`}>{title}</p>
            <div className="relative w-full">
                <input type="text" placeholder={placeholder} className={`${cn(theme.calendar.content)}`} readOnly />
            </div>
        </div>
    )
}