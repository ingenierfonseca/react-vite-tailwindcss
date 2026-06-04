import { Skeleton } from "@mui/material";

interface PermissionGridSkeletonProps {
  rows?: number;
}

export default function PermissionGridSkeleton({ rows = 5 }: PermissionGridSkeletonProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-600">
            <th className="text-left py-2 px-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              Recurso
            </th>
            <th className="text-center py-2 px-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              Ver
            </th>
            <th className="text-center py-2 px-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              Crear
            </th>
            <th className="text-center py-2 px-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              Editar
            </th>
            <th className="text-center py-2 px-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              Todo
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr
              key={i}
              className="border-b border-slate-100 dark:border-slate-700"
            >
              <td className="py-3 px-2">
                <Skeleton variant="text" width="65%" />
              </td>
              <td className="text-center py-3 px-2">
                <div className="flex justify-center">
                  <Skeleton variant="circular" width={20} height={20} />
                </div>
              </td>
              <td className="text-center py-3 px-2">
                <div className="flex justify-center">
                  <Skeleton variant="circular" width={20} height={20} />
                </div>
              </td>
              <td className="text-center py-3 px-2">
                <div className="flex justify-center">
                  <Skeleton variant="circular" width={20} height={20} />
                </div>
              </td>
              <td className="text-center py-3 px-2">
                <div className="flex justify-center">
                  <Skeleton variant="circular" width={20} height={20} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
