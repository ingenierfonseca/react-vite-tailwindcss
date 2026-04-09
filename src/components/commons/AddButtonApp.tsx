import { Plus } from "lucide-react";

interface AddButtonAppProps {
    label: string,
    onclick: () => void
}
export default function AddButtonApp({ label, onclick }: AddButtonAppProps) {
    return (
        <button
            onClick={onclick}
            className="flex p-3 cursor-pointer bg-primary rounded-md items-center text-white text-sm font-semibold shadow-md shadow-slate-300 hover:scale-[1.02] active:scale-[0.98] transition">
            <Plus className="mr-2" />
            {label}
        </button>
    )
}

export function FloatingAddButton({ label, onclick }: AddButtonAppProps) {
    return (
        <button
            onClick={onclick}
            className="flex md:hidden fixed items-center justify-center bottom-5 left-1/2 -translate-x-1/2 
            z-0 w-[80%] py-3 rounded-2xl text-white font-semibold text-sm
            bg-linear-to-r from-pink-500 to-purple-600  shadow-md
            hover:scale-[1.02] active:scale-[0.98] transition">
            <Plus className="mr-2" />
            {label}
        </button>
    )
}