import type { SessionPlan, SessionPlanItem } from "@/services/treatment-plan/treatmentPlan.type"
import { useEffect, useState } from "react"
import { calculateMonthsBetweenDates } from "@/utils/date.util"
import { SessionPlanService } from "@/services/session-plan/sessionPlan.service"
import type { ClinicalFile } from "@/models/clinicalFile.type"
import { ClinicalFileService } from "@/services/clinical-file/clinicalFile.service"
import type { ClinicalNote } from "@/models/clinicalNote.type"
import { ClinicalNoteService } from "@/services/clinical-note/clinicalNote.service"
import TreatmentProgressCard from "./resume-history-tab/cards/TreatmentProgressCard"
import TreatmentEvolutionCard from "./resume-history-tab/cards/TreatmentEvolutionCard"
import NextAppointmentCard from "./resume-history-tab/cards/NextAppointmentCard"
import TreatmentPlanCard from "./resume-history-tab/cards/TreatmentPlanCard"
import PaymentHistoryCard from "./resume-history-tab/cards/PaymentHistoryCard"
import RecentNotesCard from "./resume-history-tab/cards/RecentNotesCard"
import IndicatorsCard from "./resume-history-tab/cards/IndicatorsCard"
import { SkeletonNotesLoader } from "./SkeletonComponent"
import {
    TreatmentProgressSkeleton,
    TreatmentEvolutionSkeleton,
    NextAppointmentSkeleton,
    TreatmentPlanSkeleton,
    PaymentHistorySkeleton,
    IndicatorsSkeleton,
} from "./resume-history-tab/skeletons"

interface ResumeHistoryTabProps {
    treatment?: SessionPlan
    customerId?: number
}

export default function ResumeHistoryTab({ treatment, customerId }: ResumeHistoryTabProps) {
    const [loading, setLoading] = useState(true)
    const [progress, setProgress] = useState<ProgressInfo>({
        percentage: 0,
        nextPlan: null,
        currentPlan: null,
        currentId: 0,
        estimatedMonths: 0,
        transcurredMonths: 0,
    })
    const [totalPaid, setTotalPaid] = useState(0)
    const [images, setImages] = useState<ClinicalFile[]>([])
    const [recentNotes, setRecentNotes] = useState<ClinicalNote[]>([])

    const loadImages = () => {
        if (!treatment?.sessionId) return
        ClinicalFileService.getImagesFromSession(treatment.sessionId!).then((data) => setImages(data))
    }

    useEffect(() => {
        if (!treatment) {
            setLoading(false)
            return
        }

        setProgress(getProgress(treatment))

        Promise.all([
            SessionPlanService.getPlanTotalPaid(treatment.id!).then((data) => setTotalPaid(data.value)),
            ClinicalFileService.getImagesFromSession(treatment.sessionId!).then((data) => setImages(data)),
            ClinicalNoteService.getNotesFromSession(treatment.sessionId!).then((data) =>
                setRecentNotes(data.slice(0, 2))
            ),
        ]).finally(() => setLoading(false))
    }, [treatment])

    if (!treatment) {
        return (
            <div className="flex flex-col gap-4 p-4">
                <p className="text-center text-slate-500 dark:text-slate-400">
                    No hay información disponible
                </p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-4 w-full">
                {loading ? (
                    <>
                        <div className="flex-[1_1_450px] min-w-0 border border-slate-200 dark:border-slate-700 rounded-xl">
                            <TreatmentProgressSkeleton />
                        </div>
                        <div className="flex-[2_1_900px] min-w-0 border border-slate-200 dark:border-slate-700 rounded-xl">
                            <TreatmentEvolutionSkeleton />
                        </div>
                    </>
                ) : (
                    <>
                        <TreatmentProgressCard progress={progress} treatment={treatment} />
                        <TreatmentEvolutionCard images={images} customerId={customerId} sessionId={treatment.sessionId} onImageUploaded={loadImages} />
                    </>
                )}
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-4">
                {loading ? (
                    <>
                        <div className="border border-slate-200 dark:border-slate-700 rounded-xl">
                            <NextAppointmentSkeleton />
                        </div>
                        <div className="border border-slate-200 dark:border-slate-700 rounded-xl">
                            <TreatmentPlanSkeleton />
                        </div>
                        <div className="border border-slate-200 dark:border-slate-700 rounded-xl">
                            <PaymentHistorySkeleton />
                        </div>
                    </>
                ) : (
                    <>
                        <NextAppointmentCard />
                        <TreatmentPlanCard treatment={treatment} />
                        <PaymentHistoryCard treatment={treatment} totalPaid={totalPaid} />
                    </>
                )}
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(380px,1fr))] gap-4">
                {loading ? (
                    <>
                        <div className="border border-slate-200 dark:border-slate-700 rounded-xl">
                            <SkeletonNotesLoader />
                        </div>
                        <div className="border border-slate-200 dark:border-slate-700 rounded-xl">
                            <IndicatorsSkeleton />
                        </div>
                    </>
                ) : (
                    <>
                        <RecentNotesCard recentNotes={recentNotes} />
                        <IndicatorsCard />
                    </>
                )}
            </div>
        </div>
    )
}

interface ProgressInfo {
    percentage: number
    currentPlan: SessionPlanItem | null
    currentId: number
    nextPlan: SessionPlanItem | null
    estimatedMonths: number
    transcurredMonths: number
}

function getProgress(treatment: SessionPlan): ProgressInfo {
    const items = treatment.items

    const defaultProgress: ProgressInfo = {
        percentage: 0,
        currentPlan: null,
        currentId: -1,
        nextPlan: null,
        estimatedMonths: 0,
        transcurredMonths: 0,
    }

    if (items.length === 0) return defaultProgress

    const start = treatment.startDate!
    const estimatedMonths = calculateMonthsBetweenDates(start, treatment.endDate!)
    const transcurredMonths = calculateMonthsBetweenDates(start, new Date().toISOString())

    let completedCount = 0
    let currentPlan: SessionPlanItem | null = null
    let nextPlan: SessionPlanItem | null = null
    let currentIndex = -1

    for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const status = item.status.toLowerCase()

        if (status === "completado") {
            completedCount++
        } else if (!currentPlan) {
            currentPlan = item
            currentIndex = i

            if (item.status.toLowerCase() === "pendiente") nextPlan = item
            else nextPlan = items[i + 1] || null
        }
    }

    return {
        percentage: Math.round((completedCount / items.length) * 100),
        currentPlan,
        currentId: currentIndex,
        nextPlan,
        estimatedMonths,
        transcurredMonths: Math.max(0, transcurredMonths),
    }
}
