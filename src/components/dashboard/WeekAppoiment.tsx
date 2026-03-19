export default function WeekAppoiment({ appointment }: { appointment: any }) {
    return (
        <div className="mt-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl hover:shadow-slate-200/20 dark:hover:shadow-slate-900/20 transition-all duration-300 group">
            <div className={`p-4 border-t border-slate-200/50 dark:border-slate-700/50`}>
                <div className={`flex items-center space-x-3 rounded-xl bg-slate-50
                        dark:bg-slate-800/50`}>
                    <img src="https://avatars.githubusercontent.com/u/16735800?v=4"
                        alt="user" className="w-15 h-15 rounded-full ring-2 ring-blue-500"
                    />
                    <div className="flex-1 min-w-0">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-shadow-amber-800 dark:text-white truncate">
                                    {appointment.name}
                                </p>
                                <p className="text-xs text-shadow-amber-500 dark:text-shadow-amber-400 truncate">
                                    {appointment.specialty}
                                </p>
                            </div>
                        </div>
                </div>
            </div>
            <div className="flex justify-between items-start w-full">
                {appointment.days.map((day: any, index: number) => (
                    <div key={index} className="place-content-center">
                        <div className="flex flex-col text-center">
                            <span className="text-sm">{day.day.toUpperCase().slice(0, 3)}</span>
                            <span className="text-2xl font-bold text-slate-500 dark:text-slate-400">{day.date}</span>
                        </div>
                        <div>
                            {day.appoiments.map((appoiment: any, idx: number) => (
                                <div key={idx} className="p-1 m-1 bg-blue-300 rounded-md">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{appoiment.time}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}