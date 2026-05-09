import { Plus } from "lucide-react"

interface AddTreatmentPlanProps {
    onClick: () => void,
    disabled: boolean
}

export default function AddTreatmentPlan({onClick, disabled}:AddTreatmentPlanProps) {
    return (
        <button className="flex flex-col gap-3 bg-slate-50 my-4 p-6 border w-fit rounded-md border-slate-300 dark:bg-slate-800 dark:border-slate-600 cursor-pointer"
            onClick={onClick}
            disabled={disabled}>
            <div className="flex gap-3">
                <div
                    className={`rounded-2xl p-1 text-white disabled:opacity-50 bg-primary dark:text-white dark:hover:bg-slate-700`}>
                    <Plus size={16} />
                </div>
                <span className="font-semibold dark:text-slate-300">Agregar Plan de Tratamiento</span>
            </div>
            <span className="text-xs dark:text-slate-300">Añade tratamientos para comenzar</span>
        </button>
    )
}