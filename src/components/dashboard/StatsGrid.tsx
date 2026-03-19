import { ArrowDownRight, ArrowUpRight, ShoppingCart } from "lucide-react"

const statsData = [
    { title: 'Total citas del mes', value: '85', change: '+5.2%', trend: 'up', icon: ShoppingCart, color: 'from-purple-500 to-pink-600', bgColor: 'bg-purple-50 dark:bg-purple-900/50', textColor: 'text-purple-600 dark:text-purple-400' },
    { title: 'Total citas del dia', value: '6', change: '+3.8%', trend: 'up', icon: ShoppingCart, color: 'from-green-500 to-teal-600', bgColor: 'bg-green-50 dark:bg-green-900/50', textColor: 'text-green-600 dark:text-green-400' },
    { title: 'Att by Dr. Melissa', value: '$8,910', change: '-1.2%', trend: 'down', icon: ShoppingCart, color: 'from-red-500 to-orange-600', bgColor: 'bg-red-50 dark:bg-red-900/50', textColor: 'text-red-600 dark:text-red-400' },
    { title: 'Att by Dr. Asistente', value: '$5,678', change: '+2.5%', trend: 'up', icon: ShoppingCart, color: 'from-blue-500 to-indigo-600', bgColor: 'bg-blue-50 dark:bg-blue-900/50', textColor: 'text-blue-600 dark:text-blue-400' },
]

export default function StatsGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {statsData.map((stat, index) => (
                <div key={index} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl hover:shadow-slate-200/20 dark:hover:shadow-slate-900/20 transition-all duration-300 group">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-shadow-amber-600 dark:text-shadow-amber-400 mb-2">{stat.title}</p>
                            <p className="text-3xl font-bold text-shadow-amber-800 dark:text-white mb-4">{stat.value}</p>
                            <div className="flex items-center space-x-2">
                                {stat.trend === 'up' ? <ArrowUpRight className="w-4 h4 text-emerald-500" /> : <ArrowDownRight className="w-4 h-4 text-red-500" />}
                                <span className={`text-sm font-semibold ${stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {stat.change}
                                </span>
                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                    vs last month
                                </span>
                            </div>
                        </div>
                        <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-all duration-200`}>
                            {<stat.icon className={`w-6 h-6 ${stat.textColor}`} />}
                        </div>
                    </div>
                    <div className="mt-4 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full bg-linear-to-r ${stat.color} rounded-full transition-all duration-100`}
                            style={{width: stat.trend === 'up' ? '75%' : '45%'}}></div>
                    </div>
                </div>
            ))}
        </div>
    )
}