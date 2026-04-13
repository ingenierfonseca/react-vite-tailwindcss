import { User } from "lucide-react";

interface AvatarInfoProps {
    avatar?: string | null;
    name: string;
    description: string;
    className?: string;
    onClick?: () => void;
}

export default function AvatarInfo({ avatar, name, description, className, onClick }: AvatarInfoProps) {
    const shortName = getFirstNameAndLastName(name);

    return (
        <button
            className={`flex my-2 cursor-pointer ${className || ""}`}
            onClick={onClick}
        >
            {avatar ? (
                <img src={avatar} className="w-15 h-15 md:w-20 md:h-20 rounded-full" />
            ) : (
                <div className="w-10 h-10 sm:w-15 sm:h-15 md:w-20 md:h-20 rounded-full p-2 bg-slate-300 flex items-center justify-center">
                    <User className="w-10 h-10 text-slate-600" />
                </div>
            )}
            <div className="ml-4 text-left">
                <p className="hidden md:block text-2xl font-semibold text-black dark:text-slate-200">{name}</p>
                <p className="block md:hidden text-lg font-semibold text-black dark:text-slate-200">{shortName}</p>
                <p className="text-md md:text-lg text-slate-600 dark:text-slate-400">{description}</p>
            </div>
        </button>
    )
}

const getFirstNameAndLastName = (fullName: string): string => {
    const parts = fullName.trim().split(" ");
    if (parts.length === 1) return parts[0]; // solo un nombre
    if (parts.length === 2) return fullName; // ya es nombre + apellido
  
    return `${parts[0]} ${parts[2]}`;
}
