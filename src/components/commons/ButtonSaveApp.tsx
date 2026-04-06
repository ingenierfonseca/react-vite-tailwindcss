import { CircularProgress } from "@mui/material";

interface ButtonSaveAppProps {
    onClick: () => void
    loading: boolean
    label: string
    className?: string
}
export default function ButtonSaveApp({ label, onClick, loading, className }: ButtonSaveAppProps) {
    return (
        <button
            onClick={onClick}
            className={`${className} 
                flex items-center justify-center gap-2 disabled:opacity-50
                mt-4 bg-primary px-4 py-2 font-semibold text-white rounded-sm 
                self-end cursor-pointer transition-all
                ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary/90'}
            `}
        >
            {loading ? (
                <>
                    <CircularProgress size={20} color="inherit" />
                    <span>Guardando...</span>
                </>
            ) : (
                `Guardar ${label}`
            )}
        </button>
    )
}