interface PatientCreateProps {
    setIsOpen: (value: boolean) => void
}
export default function PatientCreate({setIsOpen}: PatientCreateProps) {
    return (
        <div className="w-full/2 h-screen py-5 px-4 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex">
                <p className="font-semibold text-black dark:text-white">Nuevo Paciente</p>
                <button 
                    onClick={() => setIsOpen(false)}
                    className="text-slate-500 hover:text-red-500 text-2xl ml-auto"
                    >
                    &times;
                </button>
            </div>
        </div>
    )
}