import { Skeleton } from "@mui/material"

export default function TreatmentPlanSkeleton() {
    return (
        <div className="p-4 space-y-4">
            <Skeleton width="45%" height={24} />
            <div className="flex flex-col gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Skeleton variant="circular" width={20} height={20} />
                            <Skeleton width={160} />
                        </div>
                        <Skeleton width={80} />
                    </div>
                ))}
            </div>
        </div>
    )
}
