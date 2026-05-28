import { useState } from "react";
import { get, type UseFormReturn } from "react-hook-form";
import { toast } from "react-toastify";
import type { SessionPlanFormValues } from "../schemas/session-plan.schema";
import { STEPS, TOTAL_STEPS } from "../utils/sessionPlanHelpers";

export const useSessionPlanStepper = (
    form: UseFormReturn<SessionPlanFormValues>
) => {
    const [step, setStep] = useState(1);
    const { trigger } = form;

    const next = async () => {
        const valid = await validateCurrentStep();

        if (!valid) return;

        setStep(prev => Math.min(prev + 1, TOTAL_STEPS));
    };

    const back = () => {
        setStep(prev => Math.max(prev - 1, 1));
    };

    const validateCurrentStep = async () => {
        const config = STEPS[step as keyof typeof STEPS];
        if (!config) return true;

        const isValid = await trigger(config.fields);

        if (!isValid) {
            console.log("fields", config.fields)
            showError(config.fields)
        }

        return isValid;
    }

    const showError = (fields: readonly string[]) => {
        fields.forEach(field => {
            const error = get(form.formState.errors, field); console.log("error", error)

            const message =
                error?.message ??
                error?.root?.message;
            if (message) {
                toast.error(message);
            }
        });
    }

    return {
        step,
        next,
        back,
    };
};