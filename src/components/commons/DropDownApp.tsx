import type { DropDownAppModel } from "../../models/dropdownapp.type";
import { FormControl, MenuItem, Select, type SelectChangeEvent } from "@mui/material";

interface DropDownAppProps {
    title: string
    data: DropDownAppModel[]
    value: string | number
    onChange?: (value: string) => void
    disabled?: boolean
}
export default function DropDownApp({title, data, value, onChange, disabled = false}: DropDownAppProps) {
    const handleChange = (event: SelectChangeEvent<string | number>) => {
        const newValue = event.target.value;
        if (onChange) {
            onChange(newValue.toString());
        }
    };

    return (
        <FormControl variant="outlined" disabled={disabled} className="flex-1" size="small">
            <Select
                id="demo-simple-select"
                value={value}
                label={title}
                onChange={handleChange}
                notched={false}
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