import { BarChart3, BriefcaseMedical, Calendar, ChevronDown, LayoutDashboard, Settings, Users } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { routesConfig } from "../../app/routesConfig";

const menuItems = [
    {
        id: "dashboard",
        icon: LayoutDashboard,
        label: "Dashboard",
        path: "/dashboard",
        badge: "New"
    },
    {
        id: "appointments",
        icon: Calendar,
        label: "Appointments",
        path: "/appointments",
        badge: "3"
    },
    {
        id: "patients",
        icon: Users,
        label: "Patients",
        count: "2.4k",
        submenu: [
            { id: "new", label: "new" },
            { id: "reports", label: "reports" }
        ]
    },
    {
        id: "reports",
        icon: BarChart3,
        label: "Reports"
    },
    {
        id: "configurations",
        icon: Settings,
        label: "Configurations",
        count: "2.4k",
        submenu: [
            { id: "app", label: "app" },
            { id: "users", label: "users" }
        ]
    },
]

interface SidebarProps {
  collapsed: boolean;
  isMobileMenuOpen: boolean;
}

function Sidebar({collapsed, isMobileMenuOpen}: SidebarProps) {
    const [expandedItems, setExpandedItems] = useState(new Set())
    const isDesktop = window.innerWidth >= 768
    const navigate = useNavigate();
    const location = useLocation();
    const currentRoute = routesConfig.find(
        (r) => r.path === location.pathname
    );

    return (
        <div className={`
            fixed md:relative top-0 left-0 h-screen z-50 flex flex-col
            transition-all duration-300 ease-in-out transform
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            w-72
            md:translate-x-0
            ${collapsed ? "md:w-20" : "md:w-72"} 
             bg-white/80 dark:bg-slate-900/80
            backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50
            z-50`}
        >
            <div className={`${collapsed ? "py-6 pl-6 " : "p-6 "} border-b border-slate-200/50 dark:border-slate-700/50`}>
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-linear-to-r from-blue-600 to-purple-600 rounded-xl
                    flex items-center justify-center shadow-lg">
                        <BriefcaseMedical className="w-6 h-6 text-white" />
                    </div>

                    {(!collapsed || !isDesktop) && (
                        <div>
                            <h3 className="text-xl fontl-bold text-slate-800 dark:text-white">
                                ClinicalSuiteNova
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
                            <button className={`w-full flex items-center justify-between p-3 rounded-xl
                                transition-all duration-200 ${currentRoute?.path === item.path ? 
                                "bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25" : 
                                "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"}`}
                                onClick={() => {
                                    const newExpanded = new Set(expandedItems)
                                    if (newExpanded.has(item.id)) {
                                        if (newExpanded.size > 0) {
                                            newExpanded.clear()
                                            setExpandedItems(newExpanded)
                                        }
                                    } else {
                                    if (newExpanded.size > 0)
                                        newExpanded.clear()

                                        newExpanded.add(item.id)
                                        setExpandedItems(newExpanded)
                                    }
                                    navigate(item.path || "/");
                                }}>
                                <div className={`flex items-center space-x-3`}>
                                    <item.icon className="w-5 h-5"/>
                                    {(!collapsed || !isDesktop) && (
                                    <>
                                        <span className="font-medium ml-2">{item.label}</span>
                                        {item.badge && (
                                            <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                                                <span className="relative -top-[0.5px]">{item.badge}</span>
                                            </span>
                                        )}
                                        {item.count && (
                                            <span className="px-2 py-1 text-xs bg-slate-200 dark:bg-slate-700
                                                text-slate-600 dark:text-slate-300 rounded-full">
                                                <span className="relative -top-[0.5px]">{item.count}</span>
                                            </span>
                                        )}
                                    </>
                                    )}
                                </div>
                                {item.submenu && (
                                    <ChevronDown className={`${expandedItems.has(item.id) ? "" : "rotate-280 "}}w-4 h-4 transition-transform`} />
                                )}
                            </button>
                            {!collapsed && item.submenu && expandedItems.has(item.id) && (
                                <div className="ml-8 mt-2 space-y1">
                                    {item.submenu.map((submenuItem) => {
                                        return <button key={submenuItem.id}>{submenuItem.label}</button>
                                    })}
                                </div>
                            )}
                        </div>
                    )
                })}
            </nav>

            <div className={`${collapsed ? "p-3 " : "p-4 "}}border-t border-slate-200/50 dark:border-slate-700/50`}>
                <div className={`${collapsed ? "p-2 " : "p-3 "}} flex items-center space-x-3 rounded-xl bg-slate-50
                        dark:bg-slate-800/50`}>
                    <img src="https://avatars.githubusercontent.com/u/16735800?v=4"
                        alt="user" className="w-10 h-10 rounded-full ring-2 ring-blue-500"
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