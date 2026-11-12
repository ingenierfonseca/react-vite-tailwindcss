import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import SideBarItem from "./SideBarItem";
import { getMenuData } from "../../models/menu.type";
import { BriefcaseMedical } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../../features/auth/presentation/useAuth";
import { usePermissions } from "../../hooks/usePermissions";
import { PermissionAction } from "../../models/permission.enum";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { ASSETS_URLS } from "@/config/constants";
import { useSettings } from "@/hooks/useSettings";

interface SidebarProps {
    collapsed: boolean;
    isMobileMenuOpen: boolean;
    isDesktop: boolean;
}

function Sidebar({ collapsed, isMobileMenuOpen, isDesktop }: SidebarProps) {
    const [expansionOverride, setExpansionOverride] = useState<{ path: string; items: Set<unknown> } | null>(null)
    const menuItems = useMemo(() => getMenuData(), []);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const { settings } = useSettings();
    const routeExpandedItems = useMemo(() => {
        const newExpanded = new Set()

        menuItems.forEach(item => {
            if (item!.submenu?.some(sub => location.pathname.includes(sub.path))) {
                newExpanded.add(item!.id)
            }
        })
        return newExpanded
    }, [location.pathname, menuItems])
    const expandedItems = expansionOverride?.path === location.pathname
        ? expansionOverride.items
        : routeExpandedItems
    const setExpandedItems = (items: Set<unknown>) => {
        setExpansionOverride({ path: location.pathname, items })
    }

    const handleLogout = async () => {
        await logout();
        navigate("/login", { replace: true });
    };

    const userInitials = user?.userName
        ? user.userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : "AD";

    const { can } = usePermissions();

    const filteredMenuItems = menuItems.map((item) => {
      if (item.resource && !can(PermissionAction.View, item.resource)) return null;
      if (!item.submenu) return item;
      const submenu = item.submenu.filter(
        (sub) => !sub.resource || can(PermissionAction.View, sub.resource),
      );
      return submenu.length > 0 ? { ...item, submenu } : null;
    }).filter(Boolean);

    return (
        <div className={`
            fixed top-0 left-0 z-50 flex h-screen w-72 flex-col overflow-x-hidden
            transition-[width,transform] duration-300 ease-in-out
            motion-reduce:transition-none
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            md:relative md:translate-x-0
            ${collapsed ? "md:w-20" : "md:w-63"}
            bg-sidebar dark:bg-slate-900/80
            backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50
            `}
        >
            {/*<button className="absolute top-6 -right-3.5 p-1 rounded-full z-1000 text-sidebar-text
              bg-sidebar-item cursor-pointer transition-colors"
                onClick={()=>{}}>
                    {collapsed && <ChevronRight className="w-5 h-5" strokeWidth={4} />}
                    {!collapsed && <ChevronLeft className="w-5 h-5" strokeWidth={4} />}
            </button>*/}
            <div className="border-b border-slate-200/50 px-4 py-6 dark:border-slate-700/50">
                <div className={`flex h-10 items-center ${collapsed && isDesktop ? "justify-center" : "gap-3"}`}>
                    <div className={`${collapsed && isDesktop ? "w-10" : "w-15"} flex h-10 shrink-0 items-center justify-center overflow-hidden bg-company-logo-background rounded-lg shadow-lg`}>
                        {settings.branding.logoUrl ? (
                            <img src={settings.branding.logoUrl} alt={settings.company.name} className="h-10 w-full rounded-xl object-contain" />
                        ) : (
                            <BriefcaseMedical className="w-10 h-10 text-primary" />
                        )}
                    </div>

                    <div
                        aria-hidden={collapsed && isDesktop}
                        className={`min-w-0 overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-200 motion-reduce:transition-none ${collapsed && isDesktop ? "max-w-0 opacity-0" : "max-w-36 opacity-100"}`}
                    >
                        <h3 className="max-w-36 truncate text-xl font-bold text-company-name dark:text-company-name-dark">
                            {settings.company.name}
                        </h3>
                        <p className="text-xs text-company-name dark:text-company-name-dark">
                            Panel de administración
                        </p>
                    </div>
                </div>
            </div>
            {/**Navigation*/}
            <nav className="sidebar-scrollbar flex-1 space-y-2 overflow-y-auto p-4">
                {filteredMenuItems.map((item) => {
                    return (
                        <div key={item!.id}>
                            <SideBarItem item={item!}
                                collapsed={collapsed}
                                isDesktop={isDesktop}
                                expandedItems={expandedItems}
                                setExpandedItems={setExpandedItems} />
                            {item!.submenu && expandedItems.has(item!.id) && (
                                <div className={`flex flex-col`}>
                                    {item!.submenu.map((submenuItem) => {
                                        return <button key={submenuItem.id} className={`flex gap-2 ${(!collapsed || !isDesktop) ? 'px-3' : 'px-2.5'} cursor-pointer hover:bg-sidebar-item/20 dark:hover:bg-slate-800/50`}
                                            onClick={() => navigate(submenuItem.path || "/")}>
                                            <div className="flex flex-col justify-center items-center">
                                                <div className="h-4 w-0.5 bg-sidebar-item"></div>
                                                <div className={`h-4 w-4 rounded-full
                                                    ${location.pathname.includes(submenuItem.path!) ? "bg-sidebar-item" : "border-2 border-sidebar-text"}`}>
                                                </div>
                                                <div className="h-4 w-0.5 bg-sidebar-item"></div>
                                            </div>
                                            {(!collapsed || !isDesktop) && (
                                            <span className={`mt-3 ${location.pathname.includes(submenuItem.path!) ? "text-sidebar-item font-bold" : "text-slate-400"}`}
                                            >{submenuItem.label}</span>)}
                                        </button>
                                    })}
                                </div>
                            )}
                        </div>
                    )
                })}
            </nav>

            <div className="border-t border-slate-200/50 px-4 py-4 dark:border-slate-700/50">
                <div className={`flex h-14 items-center gap-3 rounded-xl p-2 bg-slate-50 dark:bg-slate-800/50 ${collapsed && isDesktop ? "justify-center" : ""}`}>
                    <Avatar size="sm">
                        <AvatarImage src={`${ASSETS_URLS.staffAvatars}${user?.avatar}`} alt={user?.userName || "Usuario"} />
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {userInitials}
                        </AvatarFallback>
                    </Avatar>
                    <div
                        aria-hidden={collapsed && isDesktop}
                        className={`min-w-0 flex-1 overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-200 motion-reduce:transition-none ${collapsed && isDesktop ? "max-w-0 opacity-0" : "max-w-40 opacity-100"}`}
                    >
                        <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                            {user?.userName || "Usuario"}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {user?.roles?.[0] || "Sin rol"}
                        </p>
                    </div>
                    {(!collapsed || !isDesktop) && (
                        <button
                            onClick={handleLogout}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                            title="Cerrar sesión"
                        >
                            <LogOut className="size-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Sidebar;
