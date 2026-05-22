import { ArrowLeft, ArrowRight, Plus, Save } from "lucide-react";
import { CircularProgress } from "@mui/material";

const classNameBnt = `
    flex gap-2 min-w-0 p-3 bg-primary rounded-md 
    items-center text-white text-sm font-semibold shadow-md 
    hover:scale-[1.02] active:scale-[0.98] transition
    disabled:opacity-50`;

interface AddButtonAppProps {
    label: string,
    onclick?: () => void
    loading?: boolean
    disabled?: boolean
}
export default function AddButtonApp({ label, onclick, loading, disabled }: AddButtonAppProps) {
    return (
        <button
            onClick={disabled || loading ? undefined : onclick}
            disabled={disabled}
            className={`${classNameBnt} ${classLoading(loading ?? false)}`}>
            <Plus className="mr-2" />
            <p className="truncate">{label}</p>
        </button>
    )
}

export function SaveButtonApp({ label, onclick, loading, disabled, ...props }: AddButtonAppProps) {
    return (
        <button
            onClick={disabled || loading ? undefined : onclick}
            disabled={disabled}
            {...props}
            className={`${classNameBnt} ${classLoading(loading ?? false)}`}>
            {loading ? (
                <>
                    <CircularProgress size={20} color="inherit" />
                    <span>Guardando...</span>
                </>
            ) : (
                <>
                    <Save className="mr-2" />
                    <span className="text-sm font-semibold">{`Guardar ${label}`}</span>
                </>
                
            )}
        </button>
    )
}

export function NextButtonApp({ label, onclick, loading, disabled }: AddButtonAppProps) {
    return (
        <button
            onClick={disabled || loading ? undefined : onclick}
            disabled={disabled}
            className={`${classNameBnt} ${classLoading(loading ?? false)}`}>
            <p className="truncate">{label}</p>
            <ArrowRight className="mr-2" />
        </button>
    )
}

export function BackButtonApp({ label, onclick, loading, disabled }: AddButtonAppProps) {
    return (
        <button
            onClick={disabled || loading ? undefined : onclick}
            disabled={disabled}
            className={`${classNameBnt} ${classLoading(loading ?? false)}`}>
            <ArrowLeft className="mr-2" />
            <p className="truncate">{label}</p>
        </button>
    )
}

export function FloatingAddButton({ label, onclick, loading, disabled }: AddButtonAppProps) {
    return (
        <button
            onClick={disabled || loading ? undefined : onclick}
            disabled={disabled}
            className={`flex md:hidden fixed items-center justify-center bottom-5 left-1/2 -translate-x-1/2 
            z-0 w-[80%] py-3 rounded-2xl text-white font-semibold text-sm
            bg-linear-to-r from-pink-500 to-purple-600  shadow-md
            hover:scale-[1.02] active:scale-[0.98] transition ${classLoading(loading ?? false)}`}>
            <Plus className="mr-2" />
            {label}
        </button>
    )
}

const classLoading = (loading: boolean) => 
    `${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary/70 hover:text-white/70 cursor-pointer'}`