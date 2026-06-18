import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import type { SessionPlanFormValues } from "../schemas/session-plan.schema";
import type { UseFormReturn } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { TotalSessionPlanService } from "../services/totalSessionPlan.service";
import { getErrorMessage } from "@/utils/error";

export const useSessionPlanSubmit = (
    form: UseFormReturn<SessionPlanFormValues>
) => {
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: async (values: SessionPlanFormValues) => {
            const result = TotalSessionPlanService.saveCompletePlan(values);
            return result;
        },

        onSuccess: (_, values) => {
            toast.success("Plan guardado");

            navigate(
                `/patients/${values.session.customerId}/treatment-plan/${_.planId}`
            );
        },

        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });

    return {
        loading: mutation.isPending,

        onSubmit: form.handleSubmit((values) =>
            mutation.mutate(values)
        ),
    };
};