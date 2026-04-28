import type React from "react";

interface ErrorCardProps {
    children: React.ReactElement,
    value: number,
    title: string,
    description: string,
    bgColor: string,
    textColor: string
}
export default function ErrorCard({children, value, title, description, bgColor, textColor}: ErrorCardProps) {
    return (
        <div className={`flex-1 flex gap-3 p-3 border border-${bgColor} rounded-lg`}>
            {children}
            <div>
                <p className="text-3xl font-semibold dark:text-slate-200">{value}</p>
                <p className={`${textColor}`}>{title}</p>
                <p className="dark:text-slate-400">{description}</p>
            </div>
        </div>
    )
}