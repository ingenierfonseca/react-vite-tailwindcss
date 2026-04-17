import { ChevronDown } from "lucide-react"
import type { MenuAppModel } from "../../models/menu.type"
import { useLocation, useNavigate } from "react-router";

interface SidebarItemsProps {
    item: MenuAppModel
    collapsed: boolean,
    isDesktop: boolean,
    expandedItems: Set<unknown>
    setExpandedItems: (value: Set<unknown>)=>void
}
export default function SideBarItem({ item, collapsed, isDesktop, expandedItems, setExpandedItems }: SidebarItemsProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const isActive =
        (item.path && location.pathname.includes(item.path)) ||
        item.submenu?.some((s) => location.pathname.includes(s.path))
    const classItem = `text-slate-600 dark:text-slate-300`

    return (//bg-linear-to-r from-blue-500 to-purple-600
        <button
            className={`w-full flex items-center justify-between p-3 rounded-xl
            cursor-pointer transition-all duration-200 ${isActive ?
            "bg-primary shadow-lg shadow-primary/25" :
            "hover:bg-primary/20 dark:hover:bg-slate-800/50"
            } 'active:scale-95 active:bg-slate-200 dark:active:bg-slate-700'`}
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
                if (item.path)
                    navigate(item.path || "/");
            }}>
            <div className={`flex items-center space-x-3`}>
                <item.icon className={`w-5 h-5 ${classItem} ${isActive ? "text-white" : ""}`} />
                {(!collapsed || !isDesktop) && (
                    <>
                        <span className={`font-medium ml-2 ${classItem} ${isActive ? "text-white" : ""}`}>
                            {item.label.slice(0, 22)}
                        </span>
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
                <ChevronDown className={`${expandedItems.has(item.id) ? "" : "rotate-280"} w-4 h-4 transition-transform ${isActive ? "text-white" : ""}`} />
            )}
        </button>
    )
}