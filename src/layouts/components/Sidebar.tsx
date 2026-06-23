import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import SideBarItem from "./SideBarItem";
import { getMenuData } from "../../models/menu.type";
import { BriefcaseMedical } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../../provider/AuthProvider";
import { usePermissions } from "../../hooks/usePermissions";
import { PermissionAction } from "../../models/permission.enum";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { ASSETS_URLS } from "@/config/constants";

interface SidebarProps {
  collapsed: boolean;
  isMobileMenuOpen: boolean;
}

function Sidebar({collapsed, isMobileMenuOpen}: SidebarProps) {
    const [expandedItems, setExpandedItems] = useState(new Set())
    const isDesktop = window.innerWidth >= 768
    const menuItems = getMenuData();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    useEffect(() => {
        const newExpanded = new Set()

        filteredMenuItems.forEach(item => {
            if (item!.submenu?.some(sub => location.pathname.includes(sub.path))) {
                newExpanded.add(item!.id)
            }
        })

        setExpandedItems(newExpanded)
    }, [location.pathname])

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
            fixed md:relative top-0 left-0 h-screen z-50 flex flex-col
            transition-all duration-300 ease-in-out transform
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0
            ${collapsed ? "md:w-20" : "md:w-72"} 
             bg-sidebar dark:bg-slate-900/80
            backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50
            z-50`}
        >
            <div className={`${collapsed ? "py-6 pl-6 " : "p-6 "} border-b border-slate-200/50 dark:border-slate-700/50`}>
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-sidebar-item rounded-xl
                    flex items-center justify-center shadow-lg">
                        <BriefcaseMedical className="w-6 h-6 text-white" />
                    </div>

                    {(!collapsed || !isDesktop) && (
                        <div>
                            
                            <div className="flex">
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                                    Clinical
                                </h3>
                                <span className="text-sidebar-item text-lg">SuiteNova</span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-300">
                                Admin Panel
                            </p>
                        </div>
                    )}
                    
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
                            {item!.submenu && expandedItems.has(item!.id) && (
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

            <div className={`${collapsed ? "p-3 " : "p-4 "} border-t border-slate-200/50 dark:border-slate-700/50`}>
                <div className={`${collapsed ? "p-2 flex-col items-center gap-2 " : "p-3 "} flex rounded-xl bg-slate-50 dark:bg-slate-800/50`}>
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <Avatar size="sm">
                      <AvatarImage src={`${ASSETS_URLS.staffAvatars}${user?.avatar}`} alt={user?.userName || "Usuario"} />
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    {(!collapsed || !isDesktop) && (
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                          {user?.userName || "Usuario"}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {user?.roles?.[0] || "Sin rol"}
                        </p>
                      </div>
                    )}
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
