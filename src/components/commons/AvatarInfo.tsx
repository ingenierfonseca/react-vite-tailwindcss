import { User } from "lucide-react";

interface AvatarInfoProps {
    avatar?: string | null;
    firstName: string;
    lastName: string;
    title: string;
    subTitle?: string;
    className?: string;
    onClick?: () => void;
}

export default function AvatarInfo({ avatar, firstName, lastName, title, onClick }: AvatarInfoProps) {
    return (
        <button type="button" onClick={onClick} className="min-w-0 text-left cursor-pointer">
            <span className="flex min-w-0 items-center gap-3">
                {avatar ? (
                    <img src={avatar} alt="" className="size-15 shrink-0 rounded-full object-cover" />
                ) : (
                    <span aria-hidden="true" className="flex size-15 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {firstName.charAt(0)}{lastName.charAt(0)}
                    </span>
                )}
                <span className="min-w-0">
                    <span className="block truncate font-medium">{firstName} {lastName}</span>
                    <span className="mt-1 block truncate text-xs text-slate-500">
                        {title}
                    </span>
                </span>
            </span>
        </button>
    )
}

export function AvatarInfoMd({ avatar, firstName, lastName, title, onClick }: AvatarInfoProps) {
    return (
        <button type="button" onClick={onClick} className="min-w-0 text-left cursor-pointer">
            <span className="flex min-w-0 items-center gap-3">
                {avatar ? (
                    <img src={avatar} alt="" className="size-10 shrink-0 rounded-full object-cover" />
                ) : (
                    <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {firstName.charAt(0)}{lastName.charAt(0)}
                    </span>
                )}
                <span className="min-w-0">
                    <span className="block truncate font-medium">{firstName} {lastName}</span>
                    <span className="mt-1 block truncate text-xs text-slate-500">
                        {title}
                    </span>
                </span>
            </span>
        </button>
    )
}

export function AvatarInfoSmall({ avatar, firstName, title, className, onClick }: AvatarInfoProps) {
    return (
        <button
            className={`flex my-2 cursor-pointer ${className || ""}`}
            onClick={onClick}
        >
            <div className="shrink-0">
            {avatar && !avatar.includes('null') ? (
                <img src={avatar} className="w-10 h-10 rounded-full" />
            ) : (
                <div className="w-10 h-10 rounded-full p-2 bg-slate-200 dark:bg-slate-300 flex items-center justify-center">
                    <User className="w-10 h-10 text-slate-500" />
                </div>
            )}
            </div>
            <div className="flex-1 min-w-0 text-left">
                <p className="text-md font-semibold px-2 text-black dark:text-slate-200 truncate">{firstName}</p>
                <p className="px-2 text-md text-slate-600 dark:text-slate-400 truncate">{title}</p>
            </div>
        </button>
    )
}
