import { Card } from "@/components/ui/card";
import ResumeTreatmentPlan from "../../../patients/components/ResumeTreatmentPlan";

interface ResumeStepProps {
}
export default function ResumeStep({ }: ResumeStepProps) {
    return (
        <Card className="w-full shrink-0 basis-full">
            <ResumeTreatmentPlan />
        </Card>
    )
}