import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import type { CardModel } from "../../models/card.type"

interface DashboardCardProps {
    stat: CardModel
    iconClassName?: string
}

export default function DashboardCard({ stat, iconClassName }: DashboardCardProps) {
    return (
        <div className="flex-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 shadow-md dark:border-slate-700/50 hover:shadow-xl hover:shadow-slate-200/20 dark:hover:shadow-slate-900/20 transition-all duration-300 group">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-shadow-amber-600 dark:text-shadow-amber-400 mb-2">{stat.title}</p>
                    <p className="text-3xl font-bold text-shadow-amber-800 dark:text-white mb-4">{stat.value}</p>
                    {stat.trend && <div className="flex items-center space-x-2">
                        {stat.trend === 'Up' ? <ArrowUpRight className="w-4 h4 text-emerald-500" /> : <ArrowDownRight className="w-4 h-4 text-red-500" />}
                        <span className={`text-sm font-semibold ${stat.trend === 'Up' ? 'text-emerald-500' : 'text-red-500'}`}>
                            {stat.change}
                        </span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                            vs last month
                        </span>
                    </div>}
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-all duration-200 ${iconClassName}`}>
                    {<stat.icon className={`w-6 h-6 ${stat.iconColor}`} />}
                </div>
            </div>
            <div className="hidden mt-4 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full bg-linear-to-r ${stat.color} rounded-full transition-all duration-100`}
                    style={{ width: stat.trend === 'up' ? '75%' : '45%' }}></div>
            </div>
        </div>
    )
}