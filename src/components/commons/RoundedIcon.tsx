export default function RoundedIcon({ icon: Icon }: { icon: React.ElementType }) {
    return (
        <div className={`w-10 h-10 p-1 flex justify-center items-center rounded-full dark:bg-slate-700 dark:text-slate-200 shrink-0`}>
            <Icon />
        </div>
    )
}