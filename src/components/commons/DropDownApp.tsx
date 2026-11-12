import type { DropDownAppModel } from "../../models/dropdownapp.type";
import { FormControl, InputAdornment, MenuItem, Select, type SelectChangeEvent } from "@mui/material";
import type { ReactElement } from "react";

interface DropDownAppProps {
    title: string
    data: DropDownAppModel[]
    value: string | number
    onChange?: (value: string) => void
    disabled?: boolean
    startIcon?: ReactElement;
    id?: string;
    required?: boolean;
    ariaLabelledBy?: string;
    className?: string;
}
export default function DropDownApp({title, data, value, onChange, disabled = false, startIcon, id, required = false, ariaLabelledBy, className = "flex-1"}: DropDownAppProps) {
    const handleChange = (event: SelectChangeEvent<string | number>) => {
        const newValue = event.target.value;
        if (onChange) {
            onChange(newValue.toString());
        }
    };

    return (
        <FormControl variant="outlined" disabled={disabled} required={required} className={className} size="small">
            <Select
                id={id ?? "demo-simple-select"}
                value={value}
                label={title}
                required={required}
                onChange={handleChange}
                notched={false}
                SelectDisplayProps={{ "aria-labelledby": ariaLabelledBy }}
                startAdornment={startIcon ? (
                    <InputAdornment position="start">{startIcon}</InputAdornment>
                ) : undefined}
            >
                {data.map((item) => {
                    return (
                        <MenuItem key={item.id} value={item.id}>
                            {item.value}
                        </MenuItem>
                    )
                })}
            </Select>
        </FormControl>
    )
}
