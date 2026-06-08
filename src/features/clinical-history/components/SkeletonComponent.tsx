import { Skeleton } from "@mui/material"

export const SkeletonNotesLoader = () => {
  return (
    <div className="p-4">
        <Skeleton width="40%" />

         
        <div className="mt-4">
            <Skeleton width="55%" />
            <Skeleton />
        </div>

        <div className="mt-4">
            <Skeleton width="55%" />
            <Skeleton />
        </div>
    </div>
  )
}