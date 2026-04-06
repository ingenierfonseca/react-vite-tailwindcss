import { UsersIcon } from "lucide-react"
import DashboardCard from "./DashboardCard"

const statsData = [
    { title: 'Pacientes atendidos este mes', value: '85', change: '+5.2%', trend: 'up', icon: UsersIcon, color: 'from-purple-500 to-pink-600', bgColor: 'bg-purple-50 dark:bg-purple-900/50', textColor: 'text-purple-600 dark:text-purple-400' },
    { title: 'Pacientes del dia', value: '6', change: '+3.8%', trend: 'up', icon: UsersIcon, color: 'from-green-500 to-teal-600', bgColor: 'bg-green-50 dark:bg-green-900/50', textColor: 'text-green-600 dark:text-green-400' },
    { title: 'Att by Dr. Melissa', value: '$8,910', change: '-1.2%', trend: 'down', icon: UsersIcon, color: 'from-red-500 to-orange-600', bgColor: 'bg-red-50 dark:bg-red-900/50', textColor: 'text-red-600 dark:text-red-400' },
    { title: 'Att by Dr. Asistente', value: '$5,678', change: '+2.5%', trend: 'up', icon: UsersIcon, color: 'from-blue-500 to-indigo-600', bgColor: 'bg-blue-50 dark:bg-blue-900/50', textColor: 'text-blue-600 dark:text-blue-400' },
]

export default function StatsGrid() {
    return (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
            {statsData.map((stat, index) => (
                <DashboardCard key={index} stat={stat} />
            ))}
        </div>
    )
}