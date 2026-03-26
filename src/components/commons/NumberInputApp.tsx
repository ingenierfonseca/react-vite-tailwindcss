import { cn, theme } from "../../utils/theme";

interface NumberInputAppProps {
    value: number
    onChange: (value: number) => void
    className?: string
    min?: number
    //max?: number
    step?: number
}
export default function NumberInputApp({value, className, min, step = 1, onChange}: NumberInputAppProps) {
    return (
        <div className={className}>
            <input 
                type="number" 
                value={value}
                min={min}
                step={step}
                onChange={(e) => {
                    const val = e.target.value

                    if (val === "") {
                        onChange(0)
                        return
                    }

                    const parsed = Number(val)
                        if (!isNaN(parsed)) {
                        onChange(parsed)
                    }
                }}
                className={`${cn(theme.inputtext.content)}`} />
        </div>
    )
}