import { BackButtonApp, NextButtonApp } from "@/components/commons/AddButtonApp";

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
import { Loader, Save } from "lucide-react";

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
        updateSession,
        updateSessionPlan,
        setItems,
        setIsOpenModal,
        setStep,
        setSessionPlan,
        handleSave,
        addPlanId,
        setCurrency
    } = useSessionPlanHook()

    useEffect(() => {
        updateSession("customerId", customer.id)
    }, [])

    return (
        <PageRightComponent
            title={"Nuevo Diagnostico"}
            onClick={() => setIsOpen(false)}>
            <div className="flex flex-col gap-4 mt-3">
                <PatientInfo customer={customer} />

                <div className="relative w-full overflow-hidden">
                    <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
                    >
                        {/* Card 1 */}
                        <Card className="w-full shrink-0 p-4">
                            <p className="text-2xl dark:text-slate-200">Información del diagnóstico</p>
                            <div className="flex gap-3">
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

                        {/* Card 2 */}
                        <Card className="w-full shrink-0">
                            <EditTreatmentPlan
                                sessionPlan={sessionPlan!}
                                items={items}
                                setIsOpenModal={setIsOpenModal}
                                updateSessionPlan={updateSessionPlan}
                                setCurrency={setCurrency}
                            />
                        </Card>

                        {/* Card 3 */}
                        <Card className="w-full shrink-0">
                            <ResumeTreatmentPlan sessionPlan={sessionPlan!} items={items} />
                        </Card>
                    </div>
                </div>
                <div className="flex gap-3 ml-auto">
                    {step > 1 && step < 4 && <BackButtonApp label="Volver" onclick={() => setStep(step - 1)} />}
                    {step != 3 && <NextButtonApp
                        label={"Continuar"}
                        onclick={() => {
                            if (step === 2 && items.length === 0) {
                                toast.error("Tiene que agregar un plan de tratamiento para continuar")
                                return
                            }
                            if (step === 3) {
                                handleSave()
                            } else
                            setStep(step + 1)
                        }}
                    />}
                    {step === 3 && 
                        <ConfirmDialog 
                            onConfirm={loading ? () => {} : handleSave}
                            title="Registrar plan"
                            description="¿Está seguro de que desea registrar este plan de tratamiento?"
                            trigger={ 
                                <button
                                disabled={loading}
                                className="flex min-w-0 p-3 cursor-pointer bg-primary rounded-md items-center text-white text-sm font-semibold shadow-md hover:scale-[1.02] active:scale-[0.98] transition">
                                    {!loading && <>
                                        <Save className="mr-2" />
                                        <p className="truncate">Guardar</p>
                                    </>}
                                    {loading && <>
                                        <Loader className="mr-2" />
                                        <p className="truncate">Guardando...</p>
                                    </>}
                                </button>
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
                        setCurrency(plan.currency)
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