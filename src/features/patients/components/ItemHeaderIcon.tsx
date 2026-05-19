import RoundedIcon from "@/components/commons/RoundedIcon";

export default function ItemHeaderIcon({ icon: Icon, label, value, className }: { icon: React.ElementType, label: string, value: string, className?: string }) {
    return (
        <div className={`${className} flex mt-3 mb-3 items-center gap-2 min-w-0`}>
            <RoundedIcon icon={Icon} />
            <div className="min-w-0">
                <p className="text-sm font-medium dark:text-slate-400 truncate">{label}</p>
                <p className="dark:text-slate-200 truncate">{value}</p>
            </div>
        </div>
    )
}