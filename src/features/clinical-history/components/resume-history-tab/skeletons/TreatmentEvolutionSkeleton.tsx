import { Skeleton } from "@mui/material"

export default function TreatmentEvolutionSkeleton() {
    return (
        <div className="p-4 space-y-4">
            <Skeleton width="50%" height={24} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-1">
                        <Skeleton variant="rectangular" height={128} sx={{ borderRadius: 2 }} />
                        <Skeleton width="60%" />
                    </div>
                ))}
            </div>
        </div>
    )
}
