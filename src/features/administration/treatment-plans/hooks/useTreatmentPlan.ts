import { useState } from "react";
import { toast } from "react-toastify";
import type { TreatmentPlan, TreatmentPlanItem } from "../../../../services/treatment-plan/treatmentPlan.type";
import { TreatmentPlanService } from "../../../../services/treatment-plan/treatmentPlan.service";

export const useTreatmentPlan = () => {
    const [item, setItem] = useState<TreatmentPlan>({
        id: 0, title: "", description: "", categoryId: 0,
        currencyId: 1, complexity: "Media",
        estimatedDurationMonths: 1, basePrice: 0,
        version: 1, isActive: true,
        items: [],
        currency: { id: 1, name: "Córdoba", code: "NIO", symbol: "C$" }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const save = async (): Promise<boolean> => {
        let success = false;
        setLoading(true);
        setError(null);
        if (!validate()) { setLoading(false); return success; }
        try {
            const itemsNormalized = item.items.map((it, idx) => ({ ...it, order: idx }));
            const payload = { ...item, items: itemsNormalized };
            if (item.id) {
                await TreatmentPlanService.put(item.id, payload);
                toast.success("Plan de tratamiento actualizado correctamente");
            } else {
                await TreatmentPlanService.post(payload);
                toast.success("Plan de tratamiento creado correctamente");
            }
            success = true;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Error al guardar el plan de tratamiento";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
        return success;
    };

    const addItem = (name: string) => {
        if (!name.trim()) return;
        const newItem: TreatmentPlanItem = {
            id: 0,
            teplateId: 0,
            name: name.trim(),
            status: "Pendiente",
            order: item.items.length,
        };
        setItem({ ...item, items: [...item.items, newItem] });
    };

    const removeItem = (index: number) => {
        const updated = item.items.filter((_, i) => i !== index);
        setItem({ ...item, items: updated });
    };

    const moveItemUp = (index: number) => {
        if (index <= 0) return;
        const updated = [...item.items];
        [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
        setItem({ ...item, items: updated });
    };

    const moveItemDown = (index: number) => {
        if (index >= item.items.length - 1) return;
        const updated = [...item.items];
        [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
        setItem({ ...item, items: updated });
    };

    function validate() {
        if (!item.title.trim()) { toast.error("El título es requerido"); return false; }
        if (!item.description.trim()) { toast.error("La descripción es requerida"); return false; }
        if (item.items.length === 0) { toast.error("Debe agregar al menos un item al plan"); return false; }
        if (item.basePrice <= 0) { toast.error("El precio base debe ser mayor a 0"); return false; }
        return true;
    }

    return {
        loading, error, save, item, setItem,
        addItem, removeItem, moveItemUp, moveItemDown
    };
};
