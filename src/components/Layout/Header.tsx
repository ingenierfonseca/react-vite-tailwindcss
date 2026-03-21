import { Menu } from "lucide-react";
import { useLocation } from "react-router";
import { routesConfig } from "../../app/routesConfig";

interface HeaderProps {
    onToggle: () => void;
}

function Header({onToggle}: HeaderProps) {
    const location = useLocation();
    const currentRoute = routesConfig.find(
        (r) => r.path === location.pathname
    );

    return(
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b
            border-slate-200/50 dark:border-slate-700/50 px-6 py-4">
            {/*Left Section*/}
            <div className="flex items-center justify-between">
                <div className={`flex items-center space-x-4`}>
                    <button className="p-2 rounded-lg text-slate-600 dark:text-slate-300
                        hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        onClick={onToggle}>
                        <Menu className="w-5 h-5" />
                    </button>
                    <h1>{currentRoute?.title}</h1>
                </div>
            </div>
        </div>
    )
}

export default Header;