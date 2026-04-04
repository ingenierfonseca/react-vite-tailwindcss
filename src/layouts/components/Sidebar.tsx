import { useState } from "react";
import SideBarItem from "./SideBarItem";
import { getMenuData } from "../../models/menu.type";
import { BriefcaseMedical } from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  isMobileMenuOpen: boolean;
}

function Sidebar({collapsed, isMobileMenuOpen}: SidebarProps) {
    const [expandedItems, setExpandedItems] = useState(new Set())
    const isDesktop = window.innerWidth >= 768
    const menuItems = getMenuData();

    return (
        <div className={`
            fixed md:relative top-0 left-0 h-screen z-50 flex flex-col
            transition-all duration-300 ease-in-out transform
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0
            ${collapsed ? "md:w-20" : "md:w-72"} 
             bg-white/80 dark:bg-slate-900/80
            backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50
            z-50`}
        >
            <div className={`${collapsed ? "py-6 pl-6 " : "p-6 "} border-b border-slate-200/50 dark:border-slate-700/50`}>
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-xl
                    flex items-center justify-center shadow-lg">
                        <BriefcaseMedical className="w-6 h-6 text-white" />
                    </div>

                    {(!collapsed || !isDesktop) && (
                        <div>
                            <h3 className="text-xl fontl-bold text-slate-800 dark:text-white">
                                Clinical<span className="text-primary">SuiteNova</span>
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Admin Panel
                            </p>
                        </div>
                    )}
                    
                </div>
            </div>
            {/**Navigation*/}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                    return (
                        <div key={item.id}>
                            <SideBarItem item={item} collapsed={collapsed} isDesktop={isDesktop} expandedItems={expandedItems} setExpandedItems={setExpandedItems} />
                            {/*!collapsed && item.submenu && expandedItems.has(item.id) && (
                                <div className="ml-8 mt-2 space-y1">
                                    {item.submenu.map((submenuItem) => {
                                        return <button key={submenuItem.id}>{submenuItem.label}</button>
                                    })}
                                </div>
                            )*/}
                        </div>
                    )
                })}
            </nav>

            <div className={`${collapsed ? "p-3 " : "p-4 "}}border-t border-slate-200/50 dark:border-slate-700/50`}>
                <div className={`${collapsed ? "p-2 " : "p-3 "}} flex items-center space-x-3 rounded-xl bg-slate-50
                        dark:bg-slate-800/50`}>
                    <img src="https://avatars.githubusercontent.com/u/16735800?v=4"
                        alt="user" className="w-10 h-10 rounded-full border-2 border-primary"
                    />
                    {(!collapsed || !isDesktop) && (
                        <div className="flex-1 min-w-0">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-shadow-amber-800 dark:text-white truncate">
                                    Marlon Fonseca
                                </p>
                                <p className="text-xs text-shadow-amber-500 dark:text-shadow-amber-400 truncate">
                                    Administrador
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Sidebar;