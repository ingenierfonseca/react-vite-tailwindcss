import ConfirmDialog from "@/components/alert-modal/ConfirmDialog";
import { BackButtonApp, NextButtonApp, SaveButtonApp } from "@/components/commons/AddButtonApp";
import { TOTAL_STEPS } from "../../utils/sessionPlanHelpers";

interface FooterActionsProps {
    step: number;
    loading: boolean;
    onBack: () => void;
    onNext: () => void;
    onSubmit: () => void;
}

export default function FooterActions({ step, loading, onBack, onNext, onSubmit }: FooterActionsProps) {
    return (
        <div className="flex gap-3 ml-auto">
            {step > 1 && step < TOTAL_STEPS && <BackButtonApp label="Volver" onclick={onBack} disabled={loading} loading={loading} />}
            {step !== TOTAL_STEPS && <NextButtonApp
                label={"Continuar"}
                disabled={loading}
                onclick={onNext}
            />}
            {step === TOTAL_STEPS &&
                <ConfirmDialog
                    onConfirm={loading ? () => { } : onSubmit}
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
    )
}