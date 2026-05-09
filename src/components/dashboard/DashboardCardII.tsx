import ProgressComponent from "../commons/ProgressComponent"

interface DashboardCardProps {
    title: string
    value: number
}

export default function DashboardCardII({ title, value }: DashboardCardProps) {
    return (
        <div className="flex-1 flex items-center gap-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 shadow-md dark:border-slate-700/50 hover:shadow-xl hover:shadow-slate-200/20 dark:hover:shadow-slate-900/20 transition-all duration-300 group">
                <div className="ml-6">
                   <ProgressComponent size={100} sizeText={20} value={value} label="" />
                </div>
                <div className={"text-black font-semibold dark:text-slate-200"}>
                    {title}
                </div>
        </div>
    )
}