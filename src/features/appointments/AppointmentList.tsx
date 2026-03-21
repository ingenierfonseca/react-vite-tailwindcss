import { CirclePlus, EllipsisVertical } from "lucide-react"

const headers = [
    '#',
    'patient name',
    'doctor',
    'department',
    'date',
    'time',
    'status',
    'action'
]

const data =
    {
        currentPage: 1,
        totalItems: 3,
        totalPages: 1,
        data: [
            {
                id: 1,
                patientName: "John Doe",
                doctor: "Dr. Smith",
                department: "Cardiology",
                date: "2024-07-01",
                time: "10:00 AM",
                status: "Completed"
            },
            {
                id: 2,
                patientName: "Jane Doe",
                doctor: "Dr. Johnson",
                department: "Neurology",
                date: "2024-07-02",
                time: "11:00 AM",
                status: "Pending"
            },
            {
                id: 3,
                patientName: "Bob Smith",
                doctor: "Dr. Williams",
                department: "Orthopedics",
                date: "2024-07-03",
                time: "02:00 PM",
                status: "Cancelled"
            }
        ]
    }


export default function AppointmentList() {
    const buttonPage = 'px-3 py-1 rounded-md bg-blue-300 text-black text-sm'
    const dropDownStyle = 'ml-1 mt-2 p-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs text-black font-bold'
    return (
        <div className="w-full p-4 bg-white rounded-2xl">
            <div className="flex pb-5">
                <div>
                    <p className="font-bold">Lista de Agendamentos</p>
                    <p className="text-xs">Puedes buscar todas tus citas aquí.</p>
                </div>
                <div className="ml-auto flex">
                    <button className="flex pl-4 pr-4 cursor-pointer bg-blue-700 rounded-2xl items-center text-white text-sm">
                        <CirclePlus className="mr-2"/>
                        Agregar Nueva Cita
                    </button>
                </div>
            </div>
            <div className="ml-auto flex gap-4 mb-4">
                    <input type="text" placeholder="Search..." className="flex-1 mt-2 p-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    <div>
                        <span className="text-sm text-black mr-2">Doctor</span>
                        <select className={`${dropDownStyle}`}>
                            <option value="">All</option>
                            <option value="Dr. Smith">Dr. Smith</option>
                        </select>
                    </div>
                    <div>
                        <span className="text-sm text-black mr-2">Status</span>
                        <select className={`${dropDownStyle}`}>
                            <option value="">All</option>
                            <option value="Completed">Completed</option>
                            <option value="Pending">Pending</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div>
                        <select className={`${dropDownStyle}`}>
                            <option value="">Hoy</option>
                            <option value="today">Semana</option>
                            <option value="today">Mes</option>
                            <option value="today">Todos</option>
                        </select>
                    </div>
                </div>

            <div className="flex flex-col">
                <div className="flex">
                    {headers.map((header) => {
                        return <span key={header} className={`flex-1 text-xs text-slate-500 uppercase font-medium`}>{header}</span>
                    })}
                </div>
                {data.data.map((item) => {
                    return (
                        <div key={item.id} className="flex items-center w-full py-2">
                            <span className="flex-1 text-sm">{item.id}</span>
                            <span className="flex-1 text-sm">{item.patientName}</span>
                            <span className="flex-1 text-sm">{item.doctor}</span>
                            <span className="flex-1 text-sm">{item.department}</span>
                            <span className="flex-1 text-sm">{item.date}</span>
                            <span className="flex-1 text-sm">{item.time}</span>
                            <span className={`flex-1`}>
                                <div className={`pl-2 pr-2 pb-0.5 w-22 text-center text-sm rounded-2xl ${getBgColorStatus(item.status)}`}>{item.status}</div>
                            </span>
                            <div className="flex flex-1">
                                <button className="pl-4 pr-4 rounded-sm bg-blue-200 border-2 border-blue-600 text-sm">Ver</button>
                                <EllipsisVertical />
                            </div>
                        </div>
                    )
                })}
                <div className="flex pt-3">
                    <p className="text-xs">Showing 1 to {data.totalPages} of {data.totalItems} entries</p>
                    <div className="ml-auto flex gap-1">
                        {data.currentPage !== 1 && (
                            <button className={`${buttonPage}`} disabled>Previous</button>
                        )}
                        {data.totalPages > 1 && Array.from({ length: data.totalPages }).map((_, index) => (
                            <button key={index} className={`${buttonPage}`}>
                                {index + 1}
                            </button>
                        ))}
                        {data.currentPage < data.totalPages && (
                            <button className={`${buttonPage}`} disabled>Next</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function getBgColorStatus(status: string) {
    switch (status) {
        case "Completed":
            return "bg-green-200 border-green-600 text-green-800"
        case "Pending":
            return "bg-yellow-200 border-yellow-600 text-yellow-800"
        case "Cancelled":
            return "bg-red-200 border-red-600 text-red-800"
        default:
            return "bg-gray-200 border-gray-600 text-gray-800"
    }
}