import { Plus } from "lucide-react";

interface AddButtonAppProps {
    label: string,
    onclick: () => void
}
export default function AddButtonApp({ label, onclick }: AddButtonAppProps) {
    return (
        <button
            onClick={onclick}
            className="flex p-3 cursor-pointer bg-primary rounded-md items-center text-white text-sm">
            <Plus className="mr-2" />
            {label}
        </button>
    )
}