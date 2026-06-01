import { useState, useRef, useEffect } from "react";
import { Menu, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { routesConfig } from "../../app/routesConfig";
import { useAuth } from "../../provider/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";

interface HeaderProps {
    onToggle: () => void;
}

function Header({onToggle}: HeaderProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentRoute = routesConfig.find(
        (r) => r.path === location.pathname
    );

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        setDropdownOpen(false);
        await logout();
        navigate("/login", { replace: true });
    };

    const userInitials = user?.name
        ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : "AD";

    return(
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b
            border-slate-200/50 dark:border-slate-700/50 px-6 py-4">
            <div className="flex items-center justify-between">
                <div className={`flex items-center space-x-4`}>
                    <button className="p-2 rounded-lg text-slate-600 dark:text-slate-300
                        hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        onClick={onToggle}>
                        <Menu className="w-5 h-5" />
                    </button>
                    <h1>{currentRoute?.title}</h1>
                </div>

                {/* User dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen((prev) => !prev)}
                        className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <Avatar size="sm">
                            <AvatarImage src="" alt={user?.name || "Usuario"} />
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                {userInitials}
                            </AvatarFallback>
                        </Avatar>
                        <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-300">
                            {user?.name || "Usuario"}
                        </span>
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-1 z-50">
                            <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700">
                                <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                                    {user?.name || "Usuario"}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                    {user?.email || ""}
                                </p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                            >
                                <LogOut className="size-4" />
                                Cerrar Sesión
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Header;
