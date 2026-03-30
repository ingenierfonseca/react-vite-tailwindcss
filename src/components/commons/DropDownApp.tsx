import { ChevronDown } from "lucide-react";
import { cn, theme } from "../../utils/theme";
import type { DropDownAppModel } from "../../models/dropdownapp.type";

interface DropDownAppProps {
    title: string
    data: DropDownAppModel[]
    value?: string | number
    onChange?: (value: string) => void
}
export default function DropDownApp({title, data, value, onChange}: DropDownAppProps) {
    return (
        <div className="flex flex-col flex-1">
            <p className={`${cn(theme.labelform)}`}>{title}</p>
            <div className="relative w-full">
                <select className={`${cn(theme.dropdown.content)} ${cn(theme.dropdown.item)}`}
                    value={value}
                    onChange={(e) => onChange && onChange(e.target.value)}>
                    {data.map((item) => {
                        return (
                            <option key={item.id} value={item.value}>{item.value}</option>
                        )
                    })}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-5 flex items-center">
                    <ChevronDown className="w-4 h-4" />
                </div>
            </div>
        </div>
    )
}