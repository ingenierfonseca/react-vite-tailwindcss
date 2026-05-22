import { BackButtonApp, NextButtonApp, SaveButtonApp } from "@/components/commons/AddButtonApp";

import PageRightComponent from "@/components/commons/PageRightComponent";
import PatientInfo from "@/components/commons/PatientInfo";
import { Card } from "@/components/ui/card";
import ThreatmentPlanModal from "@/features/invoice/components/TreatmentPlanModal";
import type { Customer } from "@/services/customer/customer.type";
import type { TreatmentPlan, TreatmentPlanItem } from "@/services/treatment-plan/treatmentPlan.type";
import EditTreatmentPlan from "./EditTreatmentPlan";
import ResumeTreatmentPlan from "./ResumeTreatmentPlan";
import { DatePicker } from "@mui/x-date-pickers";
import DropDownApp from "@/components/commons/DropDownApp";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { useSessionPlanHook } from "../hooks/sessionPlan.hook";
import { useEffect } from "react";
import { ConfirmDialog } from "@/components/alert-modal/ConfirmDialog";

interface ClinicalAssessmentProps {
    customer: Customer;
    setIsOpen: (value: boolean) => void;
}
export default function ClinicalAssessment({ customer, setIsOpen }: ClinicalAssessmentProps) {
    const {
        session,
        doctors,
        sessionPlan,
        items,
        isOpenModal,
        step,
        loading,
        paymentTerm,
        request,
        updateSession,
        updateSessionPlan,
        updateRequestField,
        setItems,
        setIsOpenModal,
        setStep,
        setSessionPlan,
        handleSave,
        addPlanId,
        setPaymentTerm
    } = useSessionPlanHook()

    useEffect(() => {
        updateSession("customerId", customer.id)
    }, [])

    return (
        <PageRightComponent
            title={"Nuevo Diagnostico"}
            onClick={() => setIsOpen(false)}>

            <div className="flex flex-col gap-4 mt-3 max-w-full min-w-0 w-full">
                <PatientInfo customer={customer} />

                <div className="flex flex-col gap-4 mt-3 w-full max-w-[calc(100vw-2rem)] md:max-w-full min-w-0 overflow-hidden">
                    <div
                        className="flex w-full transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
                    >
                        {/* Card 1 */}
                        <div className="w-full min-w-full shrink-0 basis-full p-1">
                        <Card className="w-full p-4">
                            <p className="text-2xl dark:text-slate-200">Información del diagnóstico</p>
                            <div className="flex flex-col md:flex-row gap-3">
                                <DatePicker
                                    className="flex-1"
                                    label="Fecha del diagnóstico"
                                    value={session?.date ? dayjs(session.date) : null}
                                    onChange={(val) => updateSession("date", val ? val.toISOString() : "")}
                                />
                                {doctors && <DropDownApp title="Doctor(a)"
                                    data={doctors} value={1}
                                    onChange={(value) => {
                                        console.log(value)
                                    }}
                                />}
                            </div>
                        </Card>
                        </div>

                        {/* Card 2 */}
                        <div className="w-full min-w-full shrink-0 basis-full p-1">
                        <Card className="w-full">
                            <EditTreatmentPlan
                                sessionPlan={sessionPlan!}
                                items={items}
                                request={request}
                                setIsOpenModal={setIsOpenModal}
                                updateSessionPlan={updateSessionPlan}
                                updateRequestField={updateRequestField}
                                setPaymentTerm={setPaymentTerm}
                            />
                        </Card>
                        </div>

                        {/* Card 3 */}
                        <Card className="w-full shrink-0 basis-full">
                            <ResumeTreatmentPlan sessionPlan={sessionPlan!} items={items} request={request} paymentTerm={paymentTerm!} />
                        </Card>
                    </div>
                </div>
                <div className="flex gap-3 ml-auto">
                    {step > 1 && step < 4 && <BackButtonApp label="Volver" onclick={() => setStep(step - 1)} disabled={loading} loading={loading} />}
                    {step != 3 && <NextButtonApp
                        label={"Continuar"}
                        disabled={loading}
                        onclick={() => {
                            if (step === 2) {
                                if (items.length === 0) {
                                    toast.error("Tiene que agregar un plan de tratamiento para continuar")
                                    return
                                }
                                if (request.paymentTermId === 0) {
                                    toast.error("Tiene que seleccionar un termino de pago para continuar")
                                    return
                                }
                                if (request.isFinanced && request.downPayment <= 0) {
                                    toast.error("Tiene que ingresar un monto para el pago inicial")
                                    return
                                }
                            }
                            setStep(step + 1)
                        }}
                    />}
                    {step === 3 && 
                        <ConfirmDialog 
                            onConfirm={loading ? () => {} : handleSave}
                            title="Registrar plan"
                            description="¿Está seguro de que desea registrar este plan de tratamiento?"
                            trigger={ 
                                <SaveButtonApp
                                    label="Plan"
                                    disabled={loading}
                                    loading={loading} />
                            } 
                        />
                    }
                </div>
            </div>
            <ThreatmentPlanModal
                isModalOpen={isOpenModal}
                setIsModalOpen={setIsOpenModal}
                onClick={(plan: TreatmentPlan, items: TreatmentPlanItem[]) => {
                    if (sessionPlan.name.length === 0) {
                        setSessionPlan(prev => ({
                            ...prev,
                            name: plan.title,
                            endDate: dayjs(sessionPlan.startDate)
                                .add(plan.estimatedDurationMonths, "month")
                                .toISOString(),
                            totalEstimatedPrice: plan.basePrice,
                            currencyId: plan.currencyId,
                            currency: plan.currency
                        }));
                    }
                    setItems(prev => [
                        ...prev,
                        ...items.map(item => ({
                            ...item,
                            status: "Pendiente"
                        }))
                    ]);
                    addPlanId(plan.id);
                }} />
        </PageRightComponent>
    )
}