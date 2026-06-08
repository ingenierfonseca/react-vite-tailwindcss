import { Skeleton } from "@mui/material"

export default function PaymentHistorySkeleton() {
    return (
        <div className="p-4 space-y-4">
            <Skeleton width="45%" height={24} />
            <div className="flex flex-col gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex justify-between">
                        <Skeleton width="40%" />
                        <Skeleton width="30%" />
                    </div>
                ))}
                <Skeleton variant="rectangular" height={8} sx={{ borderRadius: 4 }} />
            </div>
        </div>
    )
}
