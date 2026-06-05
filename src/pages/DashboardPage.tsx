import { useEffect, useState } from "react"
import StatsGrid from "../components/dashboard/StatsGrid"
import OrthoChart from "../components/dashboard/OrthoChart"
import WeekAppoiment from "../components/dashboard/WeekAppoiment"

const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

const weekAppoiments = [
    {
        name: 'Dra. Melissa Fonseca',
        specialty: 'Ortodoncia . Especialista Certificada',
        avatar: 'https://scontent-bog2-2.xx.fbcdn.net/v/t1.6435-9/33609023_2027018804036941_7487435140159766528_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=7b2446&_nc_ohc=bDZQ6_PDGB8Q7kNvwE9fEBk&_nc_oc=AdrI8hhK6K2UOT3zLs0po_jHfPAqfygoQXSQ8Q_bUKty4DL3aQQE58L9DGafxiYOMcI&_nc_zt=23&_nc_ht=scontent-bog2-2.xx&_nc_gid=_rZVziTmO-hXzIimVGW1YA&_nc_ss=7a30f&oh=00_Afwsvzfzvcl9BCl8410F4KOvlpgYW8HDzolNYo8EUpmr5g&oe=69E41FF1',
        days: [
            {
                day: 'Monday',
                date: '28',
                count: 5,
                appoiments: [
                    { time: '09:00AM', patient: 'John Doe', status: 'confirmed' },
                    { time: '10:30AM', patient: 'Jane Smith', status: 'pending' },
                ]
            },
            {
                day: 'Tuesday',
                date: '29',
                count: 0,
                appoiments: [
                    { time: '09:00AM', patient: 'John Doe', status: 'confirmed' },
                    { time: '10:30AM', patient: 'Jane Smith', status: 'pending' }
                ]
            },
            {
                day: 'Wednesday',
                date: '30',
                count: 0,
                appoiments: [
                    { time: '09:00AM', patient: 'John Doe', status: 'confirmed' },
                    { time: '10:30AM', patient: 'Jane Smith', status: 'pending' }
                ]
            },
            {
                day: 'Thursday',
                date: '31',
                current: true,
                count: 0,
                appoiments: [
                    { time: '09:00AM', patient: 'John Doe', status: 'confirmed' },
                    { time: '10:30AM', patient: 'Jane Smith', status: 'pending' },
                    { time: '11:30AM', patient: '', status: 'free' },
                    { time: '12:30AM', patient: '', status: 'free' },
                    { time: '10:00PM', patient: 'Thiago Fonseca', status: 'confirmed' },
                    { time: '11:00PM', patient: '', status: 'canceled' },
                ]
            },
            {
                day: 'Friday',
                date: '01',
                count: 0,
                appoiments: [
                    { time: '09:00AM', patient: 'John Doe', status: 'confirmed' },
                    { time: '10:30AM', patient: 'Jane Smith', status: 'pending' }
                ]
            },
            {
                day: 'Saturday',
                date: '02',
                count: 0,
                appoiments: [
                    { time: '09:00AM', patient: 'John Doe', status: 'confirmed' },
                    { time: '10:30AM', patient: 'Jane Smith', status: 'pending' }
                ]
            },
        ]
    },
    {
        name: 'Dr. Marlon Fonseca',
        specialty: 'odontologia general',
        avatar: 'https://avatars.githubusercontent.com/u/16735800?v=4',
        days: [
            {
                day: 'Monday',
                count: 5,
                date: '28',
                appoiments: [
                    { time: '09:00 AM', patient: 'John Doe', status: 'confirmed' },
                    { time: '10:30 AM', patient: 'Jane Smith', status: 'pending' },
                ]
            },
            {
                day: 'Tuesday',
                date: '29',
                count: 0,
                appoiments: []
            },
            {
                day: 'Wednesday',
                date: '30',
                count: 0,
                appoiments: []
            },
            {
                day: 'Thursday',
                date: '31',
                current: true,
                count: 0,
                appoiments: []
            },
            {
                day: 'Friday',
                date: '01',
                count: 0,
                appoiments: [
                    { time: '09:00 AM', patient: 'John Doe', status: 'confirmed' },
                    { time: '10:30 AM', patient: 'Jane Smith', status: 'pending' }
                ]
            },
            {
                day: 'Saturday',
                date: '02',
                count: 0,
                appoiments: []
            },

        ]
    },
]

export default function DashboardPage() {
    const [mounted, setMounted] = useState(false)
    const now = new Date()
    const mesActual = meses[now.getMonth()]

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <div className="min-h-screen">
            <div className="relative">
                <div className="absolute inset-0 bg-white pointer-events-none" />
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: 'radial-gradient(circle at 25% 25%, white 0%, transparent 50%), radial-gradient(circle at 75% 75%, white 0%, transparent 50%)'
                }} />
                <div className="absolute top-0 right-0 w-125 h-125 bg-linear-to-bl from-violet-500/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-100 h-100 bg-linear-to-tr from-fuchsia-500/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 p-4 space-y-6">
                    <div className={`transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <div className="flex items-center justify-between mb-1">
                            <div>
                                <h1 className="text-2xl font-bol tracking-tight">
                                    Panel de Control
                                </h1>
                                <p className="text-sm mt-0.5">
                                    Resumen financiero y de pacientes · <span className="text-white/60 font-medium">{mesActual} {now.getFullYear()}</span>
                                </p>
                            </div>
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-xs text-white/50">Sistema activo</span>
                            </div>
                        </div>
                    </div>

                    <div className={`transition-all duration-700 delay-100 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <StatsGrid />
                    </div>

                    <div className={`transition-all duration-700 delay-200 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <OrthoChart />
                    </div>

                    <div className={`bg-linear-to-br from-slate-900 via-slate-800 to-indigo-950 transition-all duration-700 delay-300 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <div className="space-y-3">
                            <h2 className="text-lg font-bold text-white/90 flex items-center gap-2">
                                <svg className="w-5 h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Agenda Semanal
                            </h2>
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                {weekAppoiments.map((item, index) => (
                                    <WeekAppoiment key={index} appointment={item} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
