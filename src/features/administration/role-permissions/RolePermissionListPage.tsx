import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CircularProgress, Typography } from "@mui/material";
import { useRolePermissions } from "./hooks/useRolePermissions";
import PermissionGrid from "../users/components/PermissionGrid";
import PermissionGridSkeleton from "./components/PermissionGridSkeleton";
import PaginatedFoot from "../../../components/pagination-data/PaginatedFoot";

export default function RolePermissionListPage() {
  const {
    loading, error, roleGroups, savingRoleId, handlePermissionsChange,
    roleData, setRoleCurrentPage,
    permData, setPermCurrentPage,
    rolePermissionsLoading, loadRolePermissions,
  } = useRolePermissions();
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

  useEffect(() => {
    if (selectedRoleId != null) {
      loadRolePermissions(selectedRoleId);
    }
  }, [selectedRoleId, loadRolePermissions]);

  const selectedGroup = roleGroups.find((g) => g.roleId === selectedRoleId);
  const selectedRoleName = roleData?.data?.find((r) => r.id === selectedRoleId)?.name ?? "";
  const activeGroup = selectedGroup ?? {
    roleId: selectedRoleId ?? 0,
    roleName: selectedRoleName,
    permissions: [],
    recordMap: {},
  };

  if (loading && !roleData && !permData) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Typography color="error" className="text-center mt-8">
        Error al cargar los permisos de roles.
      </Typography>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <Typography variant="h5" className="font-semibold text-slate-800 dark:text-slate-100">
        Roles y Permisos
      </Typography>
      <div className="flex gap-3 items-start">
        <Card className="w-72 shrink-0 shadow-sm border border-slate-200 dark:border-slate-700">
          <CardHeader
            title={
              <Typography variant="h6" className="text-slate-800 dark:text-slate-100">
                Roles
              </Typography>
            }
            className="pb-0"
          />
          <CardContent className="pb-0">
            {roleData ? (
              <div className="space-y-1">
                {roleData.data.map((role) => (
                  <div
                    key={role.id}
                    onClick={() => setSelectedRoleId(role.id)}
                    className={`px-3 py-2 rounded cursor-pointer text-sm transition-colors ${
                      selectedRoleId === role.id
                        ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    } ${savingRoleId === role.id ? "opacity-50" : ""}`}
                  >
                    {role.name}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-center py-4">
                <CircularProgress size={20} />
              </div>
            )}
          </CardContent>
          {roleData && (
            <PaginatedFoot
              sizeData={roleData.totalItems}
              currentPage={roleData.currentPage}
              totalPages={roleData.totalPages}
              onPageChange={setRoleCurrentPage}
            />
          )}
        </Card>
        <Card className="flex-1 shadow-sm border border-slate-200 dark:border-slate-700 min-w-0">
          <CardHeader
            title={
              <Typography variant="h6" className="text-slate-800 dark:text-slate-100">
                {selectedRoleId ? `Permisos: ${selectedRoleName}` : "Permisos"}
              </Typography>
            }
            className="pb-0"
          />
          <CardContent className="pb-0">
            {selectedRoleId ? (
              rolePermissionsLoading ? (
                <PermissionGridSkeleton rows={5} />
              ) : permData ? (
                <PermissionGrid
                  allPermissions={permData.data}
                  permissions={activeGroup.permissions}
                  onChange={(newPermissions) => handlePermissionsChange(activeGroup, newPermissions)}
                  disabled={savingRoleId === activeGroup.roleId}
                />
              ) : (
                <div className="flex justify-center py-4">
                  <CircularProgress size={20} />
                </div>
              )
            ) : (
              <Typography className="text-slate-500 dark:text-slate-400 text-sm">
                Seleccione un rol para ver sus permisos.
              </Typography>
            )}
          </CardContent>
          {permData && selectedRoleId && (
            <PaginatedFoot
              sizeData={permData.totalItems}
              currentPage={permData.currentPage}
              totalPages={permData.totalPages}
              onPageChange={setPermCurrentPage}
            />
          )}
        </Card>
      </div>
    </div>
  );
}
