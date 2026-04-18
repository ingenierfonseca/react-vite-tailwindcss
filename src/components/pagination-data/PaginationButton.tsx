interface PaginationButtonProps {
    onClick: () => void;
    disabled?: boolean;
    children: React.ReactNode;
    active?: boolean;
}

export default function PaginationButton({ onClick, disabled, children, active }: PaginationButtonProps) {
    return (
        <button 
            onClick={onClick} 
            disabled={disabled} 
            className={`flex justify-center items-center p-1 w-6 h-6 border border-slate-300 rounded ${disabled ? 'bg-slate-200 cursor-not-allowed' : active ? 'bg-primary text-white border-0' : 'bg-white hover:bg-slate-100'}`}>
            {children}
        </button>
    )
}