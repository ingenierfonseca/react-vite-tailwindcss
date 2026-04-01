import { Plus } from "lucide-react";

interface AddButtonAppProps {
    label: string
}
export default function AddButtonApp({ label }: AddButtonAppProps) {
    return (
        <button className="flex p-3 cursor-pointer bg-blue-700 rounded-md items-center text-white text-sm dark:bg-slate-300 dark:text-black">
            <Plus className="mr-2" />
            {label}
        </button>
    )
}