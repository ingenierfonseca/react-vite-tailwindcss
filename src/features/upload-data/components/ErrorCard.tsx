import { Check, TriangleAlert, X } from "lucide-react";

interface ErrorCardProps {
    value: number,
    title: string,
    description: string,
    status: 'valido' | 'invalido' | 'duplicado'
}

export default function ErrorCard({ status, value, title, description }: ErrorCardProps) {
    const configs = {
        valido: {
            bgColor: "bg-green-400/5",
            borderColor: "border-green-500",
            color: "text-green-500",
            icon: <Check size={45} className="text-green-500 p-1 border-2 rounded-full" />,
            text: "Válido"
        },
        invalido: {
            bgColor: "bg-red-400/5",
            borderColor: "border-red-500",
            color: "text-red-500",
            icon: <X size={45} className="text-red-500 p-1 border-2 rounded-full" />,
            text: "Inválido"
        },
        duplicado: {
            bgColor: "bg-yellow-400/5",
            borderColor: "border-yellow-500",
            color: "text-yellow-600",
            icon: <TriangleAlert size={45} className="text-yellow-500" />,
            text: "Duplicado"
        }
    };

    const config = configs[status];

    return (
        <div className={`flex-1 flex gap-3 p-3 ${config.bgColor} border ${config.borderColor} rounded-lg`}>
            {config.icon}   
            <div>
                <p className="text-3xl font-semibold text-black dark:text-slate-200">{value}</p>
                <p className={`font-semibold ${config.color}`}>{title}</p>
                <p className="dark:text-slate-400">{description}</p>
            </div>
        </div>
    )
}