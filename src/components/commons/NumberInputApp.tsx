import { TextField } from "@mui/material";

interface NumberInputAppProps {
    title: string
    value: number
    onChange: (value: number) => void
    className?: string
    min?: number
    max?: number
    step?: number
    disabled?: boolean
    shrink?: boolean
    permitDecimal?: boolean
}
export default function NumberInputApp({ title, value, className, max, onChange, disabled = false, shrink = false, permitDecimal = false }: NumberInputAppProps) {
    return (
        <TextField
            className={className}
            label={title}
            variant="outlined"
            type="number"
            value={value === 0 ? "" : value}
            disabled={disabled}
            slotProps={{
                inputLabel: { 
                    shrink: shrink,
                } ,
                htmlInput: {
                    min: 0,
                    max: max,
                    step: permitDecimal ? "any" : 1,
                },
            }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const val = permitDecimal 
                    ? parseFloat(e.target.value) 
                    : parseInt(e.target.value, 10);
                onChange(isNaN(val) ? 0 : val);
            }}
        />
    )
}