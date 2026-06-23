import type { ReactElement } from "react";

interface CustomerItemInfoProps {
    title: string
    value: string
    icon: ReactElement
}

export default function CustomerItemInfo({title, value, icon}: CustomerItemInfoProps) {
    return (
        <div className="flex pb-3 pt-3 justify-between text-lg border-b border-slate-300">
            <div className="flex gap-3 justify-center min-w-0">
                <div className="bg-slate-50 p-2 rounded-2xl">
                    {icon}
                </div>
                <p className="truncate min-w-0 max-w-full">{title}</p>
            </div>
            <p className="dark:text-slate-400 shrink-0">{value}</p>
        </div>
    )
}