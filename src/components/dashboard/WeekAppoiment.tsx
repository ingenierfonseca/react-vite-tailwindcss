import { useEffect, useState } from "react";

export default function WeekAppoiment({ appointment }: { appointment: any }) {
    const [, setTick] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setTick(prev => prev + 1);
        }, 1 * 60 * 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex-1 bg-linear-to-br from-white/[0.07] to-white/2 backdrop-blur-xl rounded-2xl p-4 border border-white/6 hover:border-white/12 transition-all duration-300 group">
            <div className="p-1 border-t border-white/4">
                <div className="flex items-center space-x-3 rounded-xl bg-white/3 p-2">
                    <img src={`${appointment.avatar}`}
                        alt="user" className="w-14 h-14 rounded-full ring-2 ring-violet-500/50 object-cover"
                    />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white/90 truncate">
                            {appointment.name}
                        </p>
                        <p className="text-xs text-white/40 truncate">
                            {appointment.specialty}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex items-stretch justify-between w-full mt-2 gap-1">
                {appointment.days.map((day: any, index: number) => (
                    <div key={index} className={`flex-1 rounded-lg ${day.current ? 'bg-amber-400/15 border border-amber-400/30' : 'bg-white/3 border border-transparent'}`}>
                        <div className="flex flex-col text-center py-1.5">
                            <span className={`text-[10px] font-semibold uppercase ${day.current ? 'text-amber-400' : 'text-white/40'}`}>
                                {day.day.toUpperCase().slice(0, 3)}
                            </span>
                            <span className={`text-lg font-bold ${day.current ? 'text-amber-400' : 'text-white/60'}`}>
                                {day.date}
                            </span>
                        </div>
                        <div className="px-1 pb-2 space-y-1">
                            {day.appoiments.map((appoiment: any, idx: number) => {
                                const isNow = isCurrentlyHappening(appoiment.time) && day.current

                                return (
                                    <div key={idx} className={`px-1.5 py-1 rounded-md text-center
                                        ${isNow ? 'bg-emerald-500/20 ring-1 ring-emerald-400/40' : 'bg-white/4'}
                                        ${appoiment.status === 'canceled' ? 'bg-white/2 opacity-40' : ''}
                                    `}>
                                        <p className={`text-[10px] leading-tight
                                            ${isNow ? 'text-emerald-300 font-bold' : 'text-white/40'}
                                            ${appoiment.status === 'canceled' ? 'line-through' : ''}
                                        `}>
                                            {appoiment.time}
                                            {isNow && <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                                        </p>
                                        {appoiment.patient && appoiment.patient !== '' && (
                                            <p className="text-[9px] text-white/30 truncate mt-0.5">
                                                {appoiment.patient}
                                            </p>
                                        )}
                                        {appoiment.status === 'free' && (
                                            <span className="text-[9px] text-emerald-400/50 font-medium">Disponible</span>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const isCurrentlyHappening = (timeStr: string) => {
    if (!timeStr) return false;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const match = timeStr.toLowerCase().match(/(\d+):(\d+)(am|pm)/);
    if (!match) return false;

    let hours: number;
    let minutes: number;
    hours = parseInt(match[1]);
    minutes = parseInt(match[2]);
    const period = match[3];

    if (period === 'pm' && hours !== 12) hours += 12;
    if (period === 'am' && hours === 12) hours = 0;

    const startTime = hours * 60 + minutes;
    const endTime = startTime + 60;

    return currentMinutes >= startTime && currentMinutes < endTime;
};
