import { X } from "lucide-react"
import type { ReactElement } from "react"

interface PageRightComponentProps {
    title: string,
    icon?: ReactElement
    onClick: () => void
    children: React.ReactNode
}

export default function PageRightComponent({ title, icon, onClick, children }: PageRightComponentProps) {
    return (
        <div className="w-full/2 h-screen pt-5 pb-18 px-4 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex">
                <div className="flex gap-3">
                    {icon}
                    <p className="text-xl md:text-2xl font-semibold text-black dark:text-white">{title}</p>
                </div>
                <button 
                    onClick={onClick}
                    className="p-1 rounded-2xl text-slate-500 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 ml-auto"
                    >
                    <X />
                </button>
            </div>
            {children}
        </div>
    )
}