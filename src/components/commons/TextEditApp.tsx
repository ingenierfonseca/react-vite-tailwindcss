import { cn, theme } from "../../utils/theme";

interface TextEditAppProps {
    value: string,
    style: string,
    disabled?: boolean
    onChange: (newValue: string) => void
}
export default function TextEditApp({value, style, disabled = false, onChange}: TextEditAppProps) {
    return (
        <div className={style}>
            <input 
                type="text" 
                value={value}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
                className={`${cn(theme.inputtext.content)}`} />
        </div>
    )
}