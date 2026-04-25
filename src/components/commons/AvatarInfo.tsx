import { User } from "lucide-react";

interface AvatarInfoProps {
    avatar?: string | null;
    name: string;
    title: string;
    subTitle?: string;
    className?: string;
    onClick?: () => void;
}

export default function AvatarInfo({ avatar, name, title, subTitle, className, onClick }: AvatarInfoProps) {
    const shortName = getFirstNameAndLastName(name);

    return (
        <button
            className={`flex my-2 cursor-pointer ${className || ""}`}
            onClick={onClick}
        >
            <div className="shrink-0">
            {avatar && !avatar.includes('null') ? (
                <img src={avatar} className="w-10 h-10 sm:w-15 sm:h-15 md:w-20 md:h-20 rounded-full" />
            ) : (
                <div className="w-10 h-10 sm:w-15 sm:h-15 md:w-20 md:h-20 rounded-full p-2 bg-slate-200 dark:bg-slate-300 flex items-center justify-center">
                    <User className="w-10 h-10 text-slate-500" />
                </div>
            )}
            </div>
            <div className="flex-1 min-w-0 ml-4 text-left">
                <p className="hidden md:block text-2xl font-semibold px-2 text-black dark:text-slate-200 truncate">{name}</p>
                <p className="block md:hidden text-lg font-semibold px-2 text-black dark:text-slate-200 truncate">{shortName}</p>
                <p className="px-2 text-md md:text-lg text-slate-600 dark:text-slate-400 truncate">{title}</p>
                <p className="w-fit px-2 bg-primary/5 dark:bg-primary/10 text-primary dark:brightness-125 rounded">{subTitle}</p>
            </div>
        </button>
    )
}

const getFirstNameAndLastName = (fullName: string): string => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0]; // solo un nombre
    if (parts.length === 2) return fullName; // ya es nombre + apellido
  
    return `${parts[0]} ${parts[2]}`;
}
