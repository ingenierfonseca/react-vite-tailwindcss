import { Card } from "@/components/ui/card";
import EditTreatmentPlan from "./EditTreatmentPlan";

interface TreatmentPlanStepProps {
    modal: {
        isOpen: boolean;
        open: () => void;
        close: () => void;
    },
}
export default function TreatmentPlanStep({ modal }: TreatmentPlanStepProps) {
    return (
        <div className="w-full min-w-full shrink-0 basis-full p-1">
            <Card className="w-full">
                <EditTreatmentPlan
                    setIsOpenModal={modal.open}
                />
            </Card>
        </div>
    )
}