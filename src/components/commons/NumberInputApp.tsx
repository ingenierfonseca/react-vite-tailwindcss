import { TextField } from "@mui/material";

interface NumberInputAppProps {
    value: number
    onChange: (value: number) => void
    className?: string
    min?: number
    max?: number
    step?: number
}
export default function NumberInputApp({ value, className, max, onChange }: NumberInputAppProps) {
    return (
        <div className={className}>
            <TextField
                className="flex-2"
                variant="outlined"
                type="number"
                value={value === 0 ? "" : value}
                slotProps={{
                    htmlInput: {
                        min: 0,
                        max: max,
                        step: 1,
                    },
                }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const val = parseInt(e.target.value, 10);
                    onChange(isNaN(val) ? 0 : val);
                }}
            />
        </div>
    )
}