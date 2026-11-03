import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [tooltipPosition, setTooltipPosition] = useState<{ left: number; top: number } | null>(null);
    const showLabels = !collapsed || !isDesktop;
    const isActive =
        (item.path && location.pathname.includes(item.path)) ||
        item.submenu?.some((s) => location.pathname.includes(s.path))
    const classItem = `text-sidebar-text dark:text-slate-300`
    const tooltipId = `sidebar-tooltip-${item.id}`;

    const updateTooltipPosition = useCallback(() => {
        if (!collapsed || !isDesktop || !buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        const tooltipWidth = 224;
        setTooltipPosition({
            left: Math.min(rect.right + 24, window.innerWidth - tooltipWidth - 8),
            top: Math.min(Math.max(rect.top + rect.height / 2, 20), window.innerHeight - 20),
        });
    }, [collapsed, isDesktop]);

    useEffect(() => {
        if (!tooltipPosition) return;
        window.addEventListener("resize", updateTooltipPosition);
        window.addEventListener("scroll", updateTooltipPosition, true);
        return () => {
            window.removeEventListener("resize", updateTooltipPosition);
            window.removeEventListener("scroll", updateTooltipPosition, true);
        };
    }, [tooltipPosition, updateTooltipPosition]);

    return (
        <>
        <button
            ref={buttonRef}
            aria-label={showLabels ? undefined : item.label}
            aria-describedby={!showLabels && tooltipPosition ? tooltipId : undefined}
            aria-expanded={item.submenu ? expandedItems.has(item.id) : undefined}
            onMouseEnter={updateTooltipPosition}
            onMouseLeave={() => setTooltipPosition(null)}
            onFocus={updateTooltipPosition}
            onBlur={() => setTooltipPosition(null)}
            className={`flex h-12 w-full items-center justify-between overflow-hidden rounded-xl p-3
            cursor-pointer transition-colors duration-200 active:scale-95 ${isActive ?
            "bg-sidebar-item shadow-lg shadow-primary/25" :
            "hover:bg-primary/20 dark:hover:bg-slate-800/50"
            }`}
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
            <div className="flex min-w-0 items-center gap-3">
                <item.icon className={`h-5 w-5 shrink-0 ${classItem} ${isActive ? "text-sidebar-text-active" : ""}`} />
                <span
                    aria-hidden={!showLabels}
                    className={`ml-2 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-medium transition-[max-width,opacity] duration-200 motion-reduce:transition-none ${classItem} ${isActive ? "text-sidebar-text-active" : ""} ${showLabels ? "max-w-40 opacity-100" : "ml-0 max-w-0 opacity-0"}`}
                >
                    {item.label.slice(0, 22)}
                </span>
                {showLabels && item.badge && (
                    <span className="shrink-0 rounded-full bg-red-500 px-2 py-1 text-xs text-white">
                        <span className="relative -top-[0.5px]">{item.badge}</span>
                    </span>
                )}
                {showLabels && item.count && (
                    <span className="shrink-0 rounded-full bg-slate-200 px-2 py-1 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                        <span className="relative -top-[0.5px]">{item.count}</span>
                    </span>
                )}
            </div>
            {item.submenu && (
                <ChevronDown className={`${expandedItems.has(item.id) ? "" : "rotate-280"} h-4 w-4 shrink-0 transition-transform ${isActive ? "text-white" : ""}`} />
            )}
        </button>
        {!showLabels && tooltipPosition && createPortal(
            <div
                id={tooltipId}
                role="tooltip"
                className="pointer-events-none fixed z-100 max-w-56 -translate-y-1/2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-xl"
                style={{ left: tooltipPosition.left, top: tooltipPosition.top }}
            >
                <span aria-hidden="true" className="absolute -left-1 top-1/2 size-2 -translate-y-1/2 rotate-45 bg-slate-900" />
                <span className="relative">{item.label}</span>
            </div>,
            document.body,
        )}
        </>
    )
}
