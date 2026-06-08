import { Skeleton } from "@mui/material"

export default function TreatmentProgressSkeleton() {
    return (
        <CardSkeletonContainer>
            <Skeleton width="55%" height={24} />
            <div className="flex gap-3 md:gap-10 mt-4">
                <Skeleton variant="circular" width={150} height={150} />
                <div className="w-full flex flex-col gap-3">
                    <div className="flex">
                        <div className="flex-1 space-y-1">
                            <Skeleton width="80%" />
                            <Skeleton width="60%" height={28} />
                        </div>
                        <div className="flex-1 space-y-1">
                            <Skeleton width="80%" />
                            <Skeleton width="60%" height={28} />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Skeleton width="40%" />
                        <Skeleton width="70%" height={24} />
                    </div>
                    <div className="space-y-1">
                        <Skeleton width="50%" height={24} />
                        <Skeleton variant="rectangular" height={8} sx={{ borderRadius: 4 }} />
                        <Skeleton width="40%" />
                    </div>
                </div>
            </div>
        </CardSkeletonContainer>
    )
}

function CardSkeletonContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className="p-4 space-y-4">
            {children}
        </div>
    )
}
