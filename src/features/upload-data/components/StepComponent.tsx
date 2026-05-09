
interface StepComponentProps {
    stepActive: number
    stepNumber: number
    title: string
    subTitle: string
}

export default function StepComponent({stepActive, stepNumber, title, subTitle}: StepComponentProps) {
    return (
        <div className="flex gap-3 items-center flex-1 min-w-0">
            <div className={`flex justify-center items-center w-10 h-10 shrink-0 ${stepActive === stepNumber ? 'bg-sidebar-item text-slate-200' : 'bg-slate-200 text-black dark:bg-slate-700'} rounded-full dark:text-slate-100 text-lg font-semibold`}>{stepNumber}</div>
            <div className="min-w-0 shrink-0 hidden md:block">
                <p className={`text-sm truncate text-black ${stepActive === stepNumber ? 'dark:text-slate-200' : 'dark:text-slate-300'} font-semibold`}>{title}</p>
                <p className="text-xs truncate dark:text-slate-400">{subTitle}</p>
            </div>
            <div className="flex-1 h-px mr-3 border-t border-dashed border-slate-300 dark:border-slate-600"></div>
        </div>
    )
}