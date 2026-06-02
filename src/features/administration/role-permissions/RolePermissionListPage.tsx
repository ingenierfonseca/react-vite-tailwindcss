import { Card, CardContent, CardHeader, CircularProgress, Typography } from "@mui/material";
import { useRolePermissions } from "./hooks/useRolePermissions";
import PermissionGrid from "../users/components/PermissionGrid";

export default function RolePermissionListPage() {
  const { loading, error, roleGroups, savingRoleId, handlePermissionsChange } = useRolePermissions();

  if (loading) {
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
      {roleGroups.map((group) => (
        <Card
          key={group.roleId}
          className={`shadow-sm border border-slate-200 dark:border-slate-700 ${savingRoleId === group.roleId ? "opacity-70" : ""}`}
        >
          <CardHeader
            title={
              <Typography variant="h6" className="text-slate-800 dark:text-slate-100">
                {group.roleName}
              </Typography>
            }
            className="pb-0"
          />
          <CardContent>
            <PermissionGrid
              permissions={group.permissions}
              onChange={(newPermissions) => handlePermissionsChange(group, newPermissions)}
              disabled={savingRoleId === group.roleId}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
