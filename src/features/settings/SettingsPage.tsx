import { useState } from "react";
import PageComponent from "../../components/commons/PageComponent";
import DashboardCard from "../../components/dashboard/DashboardCard";
import type { CardModel } from "../../models/card.type";


const dashcboardData: CardModel[] = [
    {
        title: "Total citas",
        value: "12",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        iconColor: "text-green-500",
        color: "from-green-400 to-green-600",
        icon: () => <div className="w-6 h-6 bg-green-500 rounded-full"></div>
    },
    {
        title: "Citas Pendientes",
        value: "5",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
        iconColor: "text-yellow-500",
        color: "from-yellow-400 to-yellow-600",
        icon: () => <div className="w-6 h-6 bg-yellow-500 rounded-full"></div>
    },
    {
        title: "Citas Completadas",
        value: "7",
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
        iconColor: "text-blue-500",
        color: "from-blue-400 to-blue-600",
        icon: () => <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
    }
]

export default function SettingsPage() {
  return (
    <PageComponent 
        title="Citas"
        description="Agregue aqui sus citas"
        textButton="Agregar Configuracion"
        onclick={()=>{
            alert("Nuevo")
        }}>
            <div className="flex gap-2">
                {dashcboardData.map((dashboard, index) => (
                <DashboardCard key={index} 
                    stat={dashboard} />
            ))}
            </div>
        <div className="border rounded-2xl p-4 bg-slate-700">
            <p className="text-white text-2xl font-bold">Hola</p>
        </div>
    </PageComponent>
  );
}