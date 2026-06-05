import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts"

const data = [
    { month: 'Ene', pacientes: 22 },
    { month: 'Feb', pacientes: 25 },
    { month: 'Mar', pacientes: 28 },
    { month: 'Abr', pacientes: 32 },
    { month: 'May', pacientes: 36 },
    { month: 'Jun', pacientes: 40, current: true },
    { month: 'Jul', pacientes: 43 },
    { month: 'Ago', pacientes: 47 },
    { month: 'Sep', pacientes: 51 },
    { month: 'Oct', pacientes: 54 },
    { month: 'Nov', pacientes: 58 },
    { month: 'Dic', pacientes: 62 },
]

const totalActual = data.reduce((sum, d) => sum + d.pacientes, 0)
const crecimiento = ((data[5].pacientes - data[0].pacientes) / data[0].pacientes * 100).toFixed(1)

function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null
    const item = payload[0].payload
    return (
        <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
            <p className="text-white/50 text-xs font-medium mb-1">{label}</p>
            <p className="text-white text-lg font-bold">
                {item.pacientes} pacientes
            </p>
            {item.current && (
                <span className="inline-block mt-1 text-[10px] font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
                    Mes actual
                </span>
            )}
        </div>
    )
}

export default function OrthoChart() {
    return (
        <div className="group relative rounded-2xl bg-linear-to-br from-slate-900 via-slate-800 to-indigo-950 backdrop-blur-xl border border-white/10 overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-violet-500/5 via-transparent to-fuchsia-500/5 pointer-events-none" />
            <div className="h-1 w-full bg-linear-to-r from-violet-500 via-fuchsia-500 to-pink-500" />

            <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 rounded-lg bg-linear-to-br from-violet-500 to-fuchsia-500">
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h2 className="text-lg font-bold text-white">Pacientes en Ortodoncia</h2>
                        </div>
                        <p className="text-sm text-white/40 ml-1">Evolución mensual de pacientes con tratamiento de ortodoncia</p>
                    </div>
                    <div className="flex gap-6">
                        <div className="text-right">
                            <p className="text-2xl font-bold text-white">{totalActual}</p>
                            <p className="text-[11px] text-white/40">Total anual</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-emerald-400">+{crecimiento}%</p>
                            <p className="text-[11px] text-white/40">Crecimiento</p>
                        </div>
                    </div>
                </div>

                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="barDefault" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#8B5CF6" />
                                    <stop offset="100%" stopColor="#6D28D9" />
                                </linearGradient>
                                <linearGradient id="barCurrent" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#FBBF24" />
                                    <stop offset="100%" stopColor="#F59E0B" />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
                                domain={[0, 'dataMax + 10']}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={false} />
                            <Bar
                                dataKey="pacientes"
                                radius={[6, 6, 0, 0]}
                                animationBegin={300}
                                animationDuration={1200}
                                animationEasing="ease-out"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={index} fill={entry.current ? 'url(#barCurrent)' : 'url(#barDefault)'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/30">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-sm bg-violet-500" />
                            Meses anteriores
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" />
                            Mes actual
                        </span>
                    </div>
                    <span>Promedio mensual: {Math.round(totalActual / data.length)} pacientes</span>
                </div>
            </div>
        </div>
    )
}
