import { User } from "lucide-react";

interface AvatarInfoProps {
    avatar?: string | null;
    name: string;
    description: string;
    className?: string;
    onClick?: () => void;
}

export default function AvatarInfo({ avatar, name, description, className, onClick }: AvatarInfoProps) {
    return (
        <button
            className={`flex my-2 cursor-pointer ${className || ""}`}
            onClick={onClick}
        >
            {avatar ? (
                <img src={avatar} className="w-20 h-20 rounded-full" />
            ) : (
                <div className="w-20 h-20 rounded-full p-2 bg-slate-300 flex items-center justify-center">
                    <User className="w-10 h-10 text-slate-600" />
                </div>
            )}
            <div className="ml-4 text-left">
                <p className="text-2xl font-semibold text-black dark:text-slate-200">{name}</p>
                <p className="text-lg text-slate-600 dark:text-slate-400">{description}</p>
            </div>
        </button>
    )
}
