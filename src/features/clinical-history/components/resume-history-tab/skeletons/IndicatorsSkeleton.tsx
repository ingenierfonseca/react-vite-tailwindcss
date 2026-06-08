import { Skeleton } from "@mui/material"

export default function IndicatorsSkeleton() {
    return (
        <div className="p-4 space-y-4">
            <Skeleton width="35%" height={24} />
            <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center border border-slate-300 rounded-lg p-2 gap-3">
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton width="40%" height={28} />
                        <Skeleton width="70%" />
                        <Skeleton width="50%" />
                    </div>
                ))}
            </div>
        </div>
    )
}
