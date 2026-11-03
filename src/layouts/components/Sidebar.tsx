import { useMemo, useState } from "react";
import { LogOut } from "lucide-react";
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

    const { can, isSuperAdmin } = usePermissions();

    const filteredMenuItems = menuItems.map((item) => {
        if (item.id === "superAdmin") {
            if (!isSuperAdmin) {
                const filteredSubmenu = item.submenu?.filter(
                    (sub) => sub.resource && can(PermissionAction.View, sub.resource)
                );
                if (!filteredSubmenu || filteredSubmenu.length === 0) return null;
                return { ...item, submenu: filteredSubmenu };
            }
            return item;
        }
        if (item.resource && !can(PermissionAction.View, item.resource)) return null;
        return item;
    }).filter(Boolean);

    return (
        <div className={`
            fixed top-0 left-0 z-50 flex h-screen w-72 flex-col overflow-x-hidden
            transition-[width,transform] duration-300 ease-in-out
            motion-reduce:transition-none
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            md:relative md:translate-x-0
            ${collapsed ? "md:w-20" : "md:w-72"}
            bg-sidebar dark:bg-slate-900/80
            backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50
            `}
        >
            <div className="border-b border-slate-200/50 px-4 py-6 dark:border-slate-700/50">
                <div className={`flex h-10 items-center ${collapsed && isDesktop ? "justify-center" : "gap-3"}`}>
                    <div className={`${collapsed && isDesktop ? "w-10" : "w-15"} flex h-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-company-logo-background shadow-lg`}>
                        {settings.branding.logoUrl ? (
                            <img src={settings.branding.logoUrl} alt={settings.company.name} className="h-10 w-full rounded-xl object-contain" />
                        ) : (
                            <BriefcaseMedical className="w-7 h-7 text-white" />
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
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {filteredMenuItems.map((item) => {
                    return (
                        <div key={item!.id}>
                            <SideBarItem item={item!}
                                collapsed={collapsed}
                                isDesktop={isDesktop}
                                expandedItems={expandedItems}
                                setExpandedItems={setExpandedItems} />
                            {item!.submenu && expandedItems.has(item!.id) && (!collapsed || !isDesktop) && (
                                <div className="flex flex-col mt-2 ml-8">
                                    {item!.submenu.map((submenuItem) => {
                                        return <button key={submenuItem.id} className={`text-left p-3 cursor-pointer hover:bg-sidebar-item/20 dark:hover:bg-slate-800/50
                                            ${location.pathname.includes(submenuItem.path!) ? "text-sidebar-item font-bold border-l" : "text-slate-400 border-l border-slate-200"}`}
                                            onClick={() => navigate(submenuItem.path || "/")}>{submenuItem.label}</button>
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
