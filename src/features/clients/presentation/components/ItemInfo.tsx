import type { ReactElement } from "react";

interface CustomerItemInfoProps {
    title: string
    value: string
    icon: ReactElement
}

export default function CustomerItemInfo({title, value, icon}: CustomerItemInfoProps) {
    return (
        <div className="flex w-full min-w-0 items-center justify-between border-b border-slate-300 pb-3 pt-3 text-lg">
            <div className="customer-info-title flex min-w-0 flex-1 items-center gap-3">
                <div className="shrink-0 rounded-2xl bg-slate-50 p-2">
                    {icon}
                </div>
                <p className="min-w-0 flex-1 truncate">{title}</p>
            </div>
            <p className="min-w-0 shrink-0 truncate text-right dark:text-slate-400">{value}</p>
        </div>
    )
}
