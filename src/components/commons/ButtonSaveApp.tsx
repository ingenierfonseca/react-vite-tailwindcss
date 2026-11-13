import { CircularProgress } from "@mui/material";
import { Save, X } from "lucide-react";

interface ButtonSaveAppProps {
    onClick: () => void
    loading: boolean
    label: string
    className?: string
    disabled?: boolean
    children?: React.ReactNode
    saveText?: string
    loadingText?: string
}
export default function ButtonSaveApp({ label, children, onClick, loading, className, disabled = false, saveText, loadingText}: ButtonSaveAppProps) {
    return (
        <button
            onClick={disabled || loading ? undefined : onClick}
            disabled={disabled || loading}
            className={`${className} 
                flex items-center justify-center gap-2 disabled:opacity-50
                bg-secondary p-2 text-white font-normal rounded-2xl
                ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-secondary/90 hover:text-white/70 cursor-pointer'}
            `}
        >
            {children && children}
            {loading ? (
                <>
                    <CircularProgress size={20} color="inherit" />
                    <span>{loadingText ?? "Guardando..."}</span>
                </>
            ) : (
                <>
                    <Save size={20} />
                    <span>{saveText ?? `Guardar ${label}`}</span>
                </>
            )}
        </button>
    )
}

interface SubmitSaveAppProps {
    loading: boolean
    label: string
    className?: string
    disabled?: boolean
    children?: React.ReactNode
}
export function SubmitSaveApp({ label, children, loading, className, disabled = false}: SubmitSaveAppProps) {
    return (
        <button
            disabled={disabled}
            type="submit"
            className={`${className} 
                flex items-center justify-center gap-2 disabled:opacity-50
                mt-4 bg-primary px-4 py-2 text-white rounded-sm 
                self-end transition-all
                ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary/70 hover:text-white/70 cursor-pointer'}
            `}
        >
            {children && children}
            {loading ? (
                <>
                    <CircularProgress size={20} color="inherit" />
                    <>Guardando...</>
                </>
            ) : (
                <>{`Guardar ${label}`}</>
            )}
        </button>
    )
}

export function ButtonApp({ label, onClick, className, disabled = false}: ButtonSaveAppProps) {
    return (
        <button
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            className={`${className}
                flex items-center justify-center disabled:opacity-50
                mt-4 bg-primary px-4 py-2 text-white rounded-sm
                hover:bg-secondary/90 hover:text-white/70 cursor-pointer
            `}
        >{label}
        </button>
    )
}

export function CancelButtonApp({ label, onClick, disabled = false}: ButtonSaveAppProps) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className="flex items-center justify-center mt-4 gap-2 px-4 py-2 rounded-sm border border-primary font-medium cursor-pointer hover:bg-slate-100"
            >
            <X />
            {label}
        </button>
    )
}
