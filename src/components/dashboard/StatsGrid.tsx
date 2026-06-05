import {
    DollarSign, UserCheck, Stethoscope, Clock, Activity, UserPlus, Users, TrendingUp
} from "lucide-react"
import DashboardCard from "./DashboardCard"
import type { CardModel } from "../../models/card.type"

const statsData: CardModel[] = [
    {
        title: 'Ingresos del Mes',
        value: '$28,450',
        numericValue: 28450,
        prefix: '$',
        change: '+12.5%',
        trend: 'up',
        icon: DollarSign,
        accentGradient: 'income',
        iconGradient: 'from-emerald-500 to-teal-500',
    },
    {
        title: 'Dra. Melissa Fonseca',
        value: '$15,890',
        numericValue: 15890,
        prefix: '$',
        change: '+8.3%',
        trend: 'up',
        icon: UserCheck,
        accentGradient: 'melissa',
        iconGradient: 'from-fuchsia-500 to-pink-500',
    },
    {
        title: 'Dr. Marlon Fonseca',
        value: '$9,200',
        numericValue: 9200,
        prefix: '$',
        change: '+4.1%',
        trend: 'up',
        icon: Stethoscope,
        accentGradient: 'marlon',
        iconGradient: 'from-blue-500 to-cyan-500',
    },
    {
        title: 'Pendientes por Cobrar',
        value: '$4,360',
        numericValue: 4360,
        prefix: '$',
        change: '-2.1%',
        trend: 'down',
        icon: Clock,
        accentGradient: 'pending',
        iconGradient: 'from-amber-500 to-orange-500',
    },
    {
        title: 'Pacientes del Mes',
        value: '142',
        numericValue: 142,
        change: '+15.2%',
        trend: 'up',
        icon: Users,
        accentGradient: 'patients',
        iconGradient: 'from-violet-500 to-purple-500',
    },
    {
        title: 'En Ortodoncia',
        value: '48',
        numericValue: 48,
        change: '+6.7%',
        trend: 'up',
        icon: Activity,
        accentGradient: 'ortho',
        iconGradient: 'from-rose-500 to-pink-600',
    },
    {
        title: 'Pacientes Hoy',
        value: '12',
        numericValue: 12,
        icon: UserPlus,
        accentGradient: 'today',
        iconGradient: 'from-sky-500 to-indigo-500',
    },
    {
        title: 'Nuevos este Mes',
        value: '18',
        numericValue: 18,
        change: '+22.5%',
        trend: 'up',
        icon: TrendingUp,
        accentGradient: 'new',
        iconGradient: 'from-lime-500 to-emerald-500',
    },
]

export default function StatsGrid() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {statsData.map((stat, index) => (
                <DashboardCard key={index} stat={stat} index={index} />
            ))}
        </div>
    )
}
