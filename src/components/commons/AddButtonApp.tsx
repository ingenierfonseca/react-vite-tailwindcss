import { ArrowLeft, ArrowRight, Plus, Save } from "lucide-react";

const classNameBnt = "flex min-w-0 p-3 cursor-pointer bg-primary rounded-md items-center text-white text-sm font-semibold shadow-md hover:scale-[1.02] active:scale-[0.98] transition"
interface AddButtonAppProps {
    label: string,
    onclick: () => void
    disabled?: boolean
}
export default function AddButtonApp({ label, onclick, disabled }: AddButtonAppProps) {
    return (
        <button
            onClick={onclick}
            disabled={disabled}
            className={classNameBnt}>
            <Plus className="mr-2" />
            <p className="truncate">{label}</p>
        </button>
    )
}

export function SaveButtonApp({ label, onclick, disabled }: AddButtonAppProps) {
    return (
        <button
            onClick={onclick}
            disabled={disabled}
            className={classNameBnt}>
            <Save className="mr-2" />
            <p className="truncate">{label}</p>
        </button>
    )
}

export function NextButtonApp({ label, onclick, disabled }: AddButtonAppProps) {
    return (
        <button
            onClick={onclick}
            disabled={disabled}
            className={classNameBnt}>
            <p className="truncate">{label}</p>
            <ArrowRight className="mr-2" />
        </button>
    )
}

export function BackButtonApp({ label, onclick, disabled }: AddButtonAppProps) {
    return (
        <button
            onClick={onclick}
            disabled={disabled}
            className={classNameBnt}>
                <ArrowLeft className="mr-2" />
            <p className="truncate">{label}</p>
        </button>
    )
}

export function FloatingAddButton({ label, onclick, disabled }: AddButtonAppProps) {
    return (
        <button
            onClick={onclick}
            disabled={disabled}
            className="flex md:hidden fixed items-center justify-center bottom-5 left-1/2 -translate-x-1/2 
            z-0 w-[80%] py-3 rounded-2xl text-white font-semibold text-sm
            bg-linear-to-r from-pink-500 to-purple-600  shadow-md
            hover:scale-[1.02] active:scale-[0.98] transition">
            <Plus className="mr-2" />
            {label}
        </button>
    )
}