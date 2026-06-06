import PageRightComponent from "@/components/commons/PageRightComponent";
import PatientInfo from "@/components/commons/PatientInfo";
import ThreatmentPlanModal from "@/features/invoice/components/TreatmentPlanModal";
import type { Customer } from "@/services/customer/customer.type";
import FooterActions from "./components/footer/FooterActions";
import DiagnosisStep from "./components/steps/DiagnosisStep";
import OdontogramStep from "./components/steps/OdontogramStep";
import DiseasesStep from "./components/steps/DiseasesStep";
import TreatmentPlanStep from "./components/steps/TreatmentPlanStep";
import ResumeStep from "./components/steps/ResumeStep";
import { useSessionPlanForm } from "./hooks/useSessionPlanForm";
import { FormProvider } from "react-hook-form";
import TreatmentPaymentPlanStep from "./components/steps/TreatmentPaymentPlanStep";
import ConsultationStep from "./components/steps/ConsultationStep";

interface ClinicalAssessmentProps {
    customer: Customer;
    setIsOpen: (value: boolean) => void;
}
export default function ClinicalAssessment({ customer, setIsOpen }: ClinicalAssessmentProps) {
    const {
        form,
        loading,
        doctors,
        step,
        next,
        back,
        onSubmit
    } = useSessionPlanForm(customer);

    return (
        <PageRightComponent
            title={"Nuevo Diagnostico"}
            onClick={() => setIsOpen(false)}>

            <div className="flex flex-col gap-4 mt-3 max-w-full min-w-0 w-full">
                <PatientInfo customer={customer} />

                <FormProvider {...form.form}>
                <div className="flex flex-col gap-4 mt-3 w-full max-w-[calc(100vw-2rem)] md:max-w-full min-w-0 overflow-hidden">
                    <div
                        className="flex w-full transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
                    >
                        {/* Step 1 */}
                        <ConsultationStep doctors={doctors!} />

                        {/* Step 2 */}
                        <OdontogramStep />

                        {/* Step 3 */}
                        <DiseasesStep />

                        {/* Step 4 */}
                        <TreatmentPlanStep
                            modal={form.modal}
                        />

                        {/* Step 5 */}
                        <TreatmentPaymentPlanStep />

                        {/* Step 6 */}
                        <ResumeStep />
                    </div>
                </div>
                </FormProvider>

                <FooterActions
                    step={step}
                    loading={loading}
                    onBack={back}
                    onNext={next}
                    onSubmit={onSubmit}
                />
            </div>
            <ThreatmentPlanModal
                modal={form.modal}
                onClick={form.addTreatmentPlan} />
        </PageRightComponent>
    )
}