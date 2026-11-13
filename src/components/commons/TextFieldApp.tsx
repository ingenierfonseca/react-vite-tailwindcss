import { InputAdornment, TextField } from "@mui/material";
import type { ReactElement } from "react";

interface TextEditAppProps {
    label: string
    value: string | undefined
    type?: string
    isRequired?: boolean
    disabled?: boolean
    maxLength?: number,
    startIcon?: ReactElement
    onChange: (newValue: string) => void
}
export default function TextEditApp({ label, value, isRequired = false, type = "text", disabled = false, maxLength, startIcon, onChange }: TextEditAppProps) {
    return (
        <div className="flex-1 flex flex-col">
            <div className="flex gap-1">
                <span className="mb-1 text-sm text-slate-800 font-medium">{label}</span>
                {isRequired && value?.length! <= 0 && <span className="text-red-500 font-medium">*</span>}
            </div>
            <TextField
                //className={`${className}`}
                //label={label}
                size="small"
                type={type}
                variant="outlined"
                value={value}
                disabled={disabled}
                slotProps={{
                    input: {
                        inputProps: {
                            maxLength: maxLength,
                            className: "dark: text-white",
                        },
                        startAdornment: (
                            <InputAdornment position="start">
                                {startIcon}
                            </InputAdornment>
                        ),
                    }
                }}
                onChange={(e) => onChange(e.target.value)}
            /*sx={{
                input: { color: '#fff' }, // texto
                label: { color: '#aaa' }, // label
                '& .MuiOutlinedInput-root': {
                    backgroundColor: '#1e1e1e',
                    '& fieldset': {
                        borderColor: '#444',
                    },
                    '&:hover fieldset': {
                        borderColor: '#666',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: '#90caf9',
                    },
                },
            }}*/
            />
        </div>
    )
}
