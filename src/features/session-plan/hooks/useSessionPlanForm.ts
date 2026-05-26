import type { Customer } from "@/services/customer/customer.type";
import { useSessionPlanStepper } from "./useSessionPlanStepper";
import { useDoctors } from "./useDoctors";
import { useSessionPlanSubmit } from "./useSessionPlanSubmit";
import { useSessionPlan } from "./useSessionPlan";

export const useSessionPlanForm = (customer: Customer) => {
    const form = useSessionPlan(customer);
    const stepper = useSessionPlanStepper(form!.form);
    const doctorsQuery = useDoctors();
    const submit = useSessionPlanSubmit(form!.form);

    return {
        form,
        doctors: doctorsQuery.data ?? [],
        loading: submit.loading,
        ...stepper,
        onSubmit: submit.onSubmit,
    };
};