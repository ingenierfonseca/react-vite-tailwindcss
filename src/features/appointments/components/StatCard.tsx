interface StatCardProps {
    icon: React.ReactNode
    label: string
    value: number
    color: string
}

export default function StatCard({ icon, label, value, color }: StatCardProps) {
    return (
        <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className={`p-2.5 rounded-xl ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                <p className="text-xl font-bold text-slate-800 dark:text-white">{value}</p>
            </div>
        </div>
    )
}
