import { InputAdornment, TextField } from "@mui/material";
import type { ReactElement } from "react";

interface TextEditAppProps {
    label: string
    value: string | undefined
    className: string
    disabled?: boolean
    maxLength?: number,
    startIcon?: ReactElement
    onChange: (newValue: string) => void
}
export default function TextEditApp({ label, value, className, disabled = false, maxLength, startIcon, onChange }: TextEditAppProps) {
    return (
        <TextField
            className={`${className}`}
            label={label}
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
                //input: { color: '#fff' }, // texto
                label: { color: '#aaa' }, // label
                '& .MuiOutlinedInput-root': {
                    //backgroundColor: '#1e1e1e',
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
    )
}