import { useCallback, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TreatmentPlanItem, TreatmentPlan } from "@/services/treatment-plan/treatmentPlan.type";
import type { Customer } from "@/services/customer/customer.type";
import { sessionPlanSchema, type SessionPlanFormValues } from "@/features/session-plan/schemas/session-plan.schema";
import { createDefaultSessionPlanValues } from "../types/sessionPlan.types";
import { buildUpdatedPlan, normalizeTreatmentItems } from "../utils/sessionPlanHelpers";

export const useSessionPlan = (customer: Customer) => {
    const [isOpen, setIsOpen] = useState(false);
    const modal = {
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
    };

    const form = useForm<SessionPlanFormValues>({
        resolver: zodResolver(sessionPlanSchema),
        defaultValues: createDefaultSessionPlanValues(customer)
    });

    const { control, getValues, setValue } = form;

    const { fields, append, remove, update } = useFieldArray({
        control,
        name: "items",
    });

    const addTreatmentPlan = useCallback((
        plan: TreatmentPlan,
        itemsToAppend: TreatmentPlanItem[]
    ) => {
        const currentValues = getValues();

        setValue(
            "plan",
            buildUpdatedPlan(currentValues.plan, currentValues.items, currentValues.session, plan),
            { shouldDirty: true, shouldValidate: true }
        );

        const normalized = normalizeTreatmentItems(itemsToAppend);
        append(normalized);

        setValue(
            "plansIds",
            [...currentValues.plansIds, plan.id],
            { shouldDirty: true }
        );
    }, [getValues, setValue, append]);

    return {
        form,
        fields,
        append,
        remove,
        update,
        modal,
        addTreatmentPlan
    };
};