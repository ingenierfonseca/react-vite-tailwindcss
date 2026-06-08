import { Skeleton } from "@mui/material"

export default function NextAppointmentSkeleton() {
    return (
        <div className="p-4 space-y-4">
            <Skeleton width="40%" height={24} />
            <div className="flex gap-3">
                <Skeleton variant="circular" width={60} height={60} />
                <div className="flex-1 space-y-1">
                    <Skeleton width="70%" />
                    <Skeleton width="45%" height={32} />
                    <Skeleton width="55%" />
                    <Skeleton width="60%" />
                </div>
            </div>
        </div>
    )
}
