import { CircularProgress } from "@mui/material";

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
            onClick={onClick}
            disabled={disabled}
            className={`${className} 
                flex items-center justify-center gap-2 disabled:opacity-50
                mt-4 bg-primary px-4 py-2 text-white rounded-sm 
                self-end cursor-pointer transition-all
                ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary/70 hover:text-white/70'}
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