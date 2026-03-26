import { cn, theme } from "../../utils/theme";

interface TextEditAppProps {
    value: string,
    style: string,
    onChange: (newValue: string) => void
}
export default function TextEditApp({value, style, onChange}: TextEditAppProps) {
    return (
        <div className={style}>
            <input 
                type="text" 
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`${cn(theme.inputtext.content)}`} />
        </div>
    )
}