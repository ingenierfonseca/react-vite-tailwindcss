import { Calendar, MessageCircleMore } from "lucide-react";

interface ItemListProps {
    className?: string
    title: string,
    subTitle: string
    content: string
    date: string
    onClick: () => void 
}
export default function ItemList({className, title, subTitle, content, date, onClick}: ItemListProps) {
    return (
        <div
            className={`flex mt-4 p-2 items-center rounded-md border border-slate-300 ${className} transition-colors`}
            onClick={onClick}>
            <div className="w-15 h-15 p-4 rounded-xl bg-primary/10 text-primary">
                <MessageCircleMore size={30} />
            </div>
            <div className="mx-2 font-medium">
                <p className="text-md font-medium text-black dark:text-white mb-2">{title}</p>
                <p className="text-md dark:text-slate-300 mb-3">{subTitle}</p>
                <p className="dark:text-slate-400 line-clamp-3">{content}</p>
            </div>
            <div className="ml-auto flex gap-2 p-4 w-26 h-22 shrink-0 justify-center items-center bg-slate-50 border border-slate-200">
                <Calendar size={30} />
                <p className="text-xs text-gray-500 dark:text-slate-400">{date}</p>
            </div>
        </div>
    )
}