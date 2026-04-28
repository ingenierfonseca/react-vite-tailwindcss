import { AlertCircle, Check, TriangleAlert } from "lucide-react";

export const getStatusBadge = (status: 'valido' | 'invalido' | 'duplicado') => {
  const configs = {
    valido: {
      color: "bg-green-400/20 text-green-500 border-green-500/20",
      icon: <Check size={16} />,
      text: "Válido"
    },
    invalido: {
      color: "bg-red-400/20 text-red-500 border-red-500/20",
      icon: <AlertCircle size={16} />,
      text: "Inválido"
    },
    duplicado: {
      color: "bg-yellow-400/20 text-yellow-600 border-yellow-500/20",
      icon: <TriangleAlert size={16} />,
      text: "Duplicado"
    }
  };

  const config = configs[status];

  return (
    <div className={`flex items-center gap-1.5 w-fit rounded-full px-3 py-0.5 border ${config.color} text-xs font-medium`}>
      {config.icon}
      {config.text}
    </div>
  );
};