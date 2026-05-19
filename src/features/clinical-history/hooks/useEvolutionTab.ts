import { useState, useMemo } from "react";
import { SessionPlanService } from "@/services/session-plan/sessionPlan.service";
import { calculateMonthsBetweenDates } from "@/utils/date.util";
import type { SessionPlan } from "@/services/treatment-plan/treatmentPlan.type";

interface UseEvolutionTabProps {
    sessionPlan?: SessionPlan;
    setSessionPlan: React.Dispatch<React.SetStateAction<SessionPlan | undefined>>;
}

export function useEvolutionTab({ sessionPlan, setSessionPlan }: UseEvolutionTabProps) {
    const [executingIds, setExecutingIds] = useState<Set<number>>(new Set());

    // Patrón Memoization: Evita re-cálculos costosos si el componente se re-renderiza por otra causa
    const durationInMonths = useMemo(() => {
        if (!sessionPlan?.startDate || !sessionPlan?.endDate) return 0;
        return calculateMonthsBetweenDates(sessionPlan.startDate, sessionPlan.endDate);
    }, [sessionPlan?.startDate, sessionPlan?.endDate]);

    const isItemLoading = (itemId: number) => executingIds.has(itemId);

    const handleChangeStatus = async (itemId: number, newStatus: string) => {
        if (!sessionPlan?.id) return;

        // Optimización Senior: Usar Set para búsquedas e inserciones O(1) en lugar de arrays
        setExecutingIds(prev => new Set(prev).add(itemId));

        try {
            await SessionPlanService.updateItemStatus({ 
                id: sessionPlan.id, 
                itemId, 
                status: newStatus 
            });

            setSessionPlan(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    items: prev.items.map(item =>
                        item.id === itemId ? { ...item, status: newStatus } : item
                    )
                };
            });
        } catch (error) {
            console.error("[ClinicalSuiteNova] Error updating item status:", error);
            // Aquí se dispararía un Toast global de error
        } finally {
            setExecutingIds(prev => {
                const next = new Set(prev);
                next.delete(itemId);
                return next;
            });
        }
    };

    return {
        durationInMonths,
        isItemLoading,
        handleChangeStatus
    };
}