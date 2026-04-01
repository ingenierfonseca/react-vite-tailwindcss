
interface PatientProfileProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function PatientProfile({ isOpen, setIsOpen }: PatientProfileProps) {
    return (
        <div className="w-full/2 h-screen bg-amber-300">
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-500 hover:text-red-500 text-2xl"
            >
              &times;
            </button>
        </div>
    )
}