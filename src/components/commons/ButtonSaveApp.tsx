import { CircularProgress } from "@mui/material";
import { Save } from "lucide-react";

interface ButtonSaveAppProps {
    onClick: () => void
    loading: boolean
    label: string
    className?: string
    disabled?: boolean
    children?: React.ReactNode
}
export default function ButtonSaveApp({ label, children, onClick, loading, className, disabled = false}: ButtonSaveAppProps) {
    return (
        <button
            onClick={disabled || loading ? undefined : onClick}
            disabled={disabled}
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
                    <span>Guardando...</span>
                </>
            ) : (
                <>
                    <Save size={20} />
                    <span className="text-sm font-semibold">{`Guardar ${label}`}</span>
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
                    <span>Guardando...</span>
                </>
            ) : (
                <span className="text-sm font-semibold">{`Guardar ${label}`}</span>
            )}
        </button>
    )
}