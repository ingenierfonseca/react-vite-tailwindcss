import type { DropDownAppModel } from "../../models/dropdownapp.type";
import { FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent } from "@mui/material";

interface DropDownAppProps {
    title: string
    data: DropDownAppModel[]
    value: string | number
    onChange?: (value: string) => void
}
export default function DropDownApp({title, data, value, onChange}: DropDownAppProps) {
    const handleChange = (event: SelectChangeEvent<string | number>) => {
        const newValue = event.target.value;
        if (onChange) {
            onChange(newValue.toString());
        }
    };

    return (
        <FormControl className="flex-1">
            <InputLabel id="demo-simple-select-label">{title}</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={value}
                label={title}
                onChange={handleChange}
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