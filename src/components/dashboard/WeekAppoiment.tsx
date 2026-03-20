export default function WeekAppoiment({ appointment }: { appointment: any }) {
    return (
        <div className="mt-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-4 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl hover:shadow-slate-200/20 dark:hover:shadow-slate-900/20 transition-all duration-300 group">
            <div className={`p-1 border-t border-slate-200/50 dark:border-slate-700/50`}>
                <div className={`flex items-center space-x-3 rounded-xl bg-slate-50
                        dark:bg-slate-800/50`}>
                    <img src={`${appointment.avatar}`}
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
            <div className="flex justify-between items-start w-full mt-1">
                {appointment.days.map((day: any, index: number) => (
                    <div key={index} className={`flex-1 place-content-center ${day.current ? 'bg-blue-200/50 rounded-md' : ''}`}>
                        <div className="flex flex-col text-center">
                            <span className="text-sm">{day.day.toUpperCase().slice(0, 3)}</span>
                            <span className="text-2xl font-bold text-slate-500 dark:text-slate-400">{day.date}</span>
                        </div>
                        <div>
                            {day.appoiments.map((appoiment: any, idx: number) => (
                                <div key={idx} className={`p-1 m-1 ${!isCurrentlyHappening(appoiment.time) ? 'bg-blue-300' : 'bg-blue-700'} rounded-md text-center`}>
                                    <p className={`text-xs ${isCurrentlyHappening(appoiment.time) ? ' font-bold text-white' : ''}  text-slate-500 dark:text-slate-400`}>
                                        {appoiment.time}
                                    </p>
                                </div>
                            ))}
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

  // Convertir "10:00am" a minutos (Soporta 10:00am, 10:00 am, 10am)
  const match = timeStr.toLowerCase().match(/(\d+):(\d+)(am|pm)/);
  if (!match) return false;

  let hours: number; 
  let minutes: number;
  hours = parseInt(match[1]);
  minutes = parseInt(match[2]);
  const period = match[3];

  // Ajuste formato 12h a 24h
  if (period === 'pm' && hours !== 12) hours += 12;
  if (period === 'am' && hours === 12) hours = 0;

  const startTime = hours * 60 + minutes;
  const endTime = startTime + 60; // La cita dura exactamente 1 hora

  // Está "Atendiéndose" si la hora actual está en ese rango
  return currentMinutes >= startTime && currentMinutes < endTime;
};