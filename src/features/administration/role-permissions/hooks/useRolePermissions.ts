import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { RolePermissionService } from "../../../../services/role-permission/rolePermission.service";
import { PermissionService } from "../../../../services/permission/permission.service";
import { RoleService } from "../../../../services/role/role.service";
import type { RolePermission } from "../../../../models/rolePermission.type";
import type { Permission } from "../../../../models/permission.type";
import type { AppRole } from "../../../../models/appRole.type";
import type { PaginatedResponse } from "../../../../models/paginatedResponse";

export interface RoleGroup {
  roleId: number;
  roleName: string;
  permissions: string[];
  recordMap: Record<string, number>;
}

async function fetchAll<T>(
  fetchFn: (params: { page: number; search: string; size?: number }) => Promise<PaginatedResponse<T>>
): Promise<T[]> {
  const firstPage = await fetchFn({ page: 1, search: "", size: 100 });
  if (firstPage.totalPages <= 1) return firstPage.data;
  let all = [...firstPage.data];
  for (let p = 2; p <= firstPage.totalPages; p++) {
    const page = await fetchFn({ page: p, search: "", size: 100 });
    all = [...all, ...page.data];
  }
  return all;
}

export const useRolePermissions = () => {
  const [permissionMap, setPermissionMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [savingRoleId, setSavingRoleId] = useState<number | null>(null);

  const [selectedRolePermissions, setSelectedRolePermissions] = useState<RolePermission[]>([]);
  const [rolePermissionsLoading, setRolePermissionsLoading] = useState(false);

  const [roleData, setRoleData] = useState<PaginatedResponse<AppRole>>();
  const [roleCurrentPage, setRoleCurrentPage] = useState(1);

  const [permData, setPermData] = useState<PaginatedResponse<Permission>>();
  const [permCurrentPage, setPermCurrentPage] = useState(1);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [allPermissions, roleResult, permResult] = await Promise.all([
        fetchAll(PermissionService.get),
        RoleService.get({ page: roleCurrentPage, search: "", size: 15 }),
        PermissionService.get({ page: permCurrentPage, search: "", size: 15 }),
      ]);
      setRoleData(roleResult);
      setPermData(permResult);
      const map: Record<string, number> = {};
      allPermissions.forEach((p) => { map[p.name] = p.id; });
      setPermissionMap(map);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [roleCurrentPage, permCurrentPage]);

  const loadRolePermissions = useCallback(async (roleId: number) => {
    setRolePermissionsLoading(true);
    try {
      const result = await RolePermissionService.getByRoleId(roleId);
      setSelectedRolePermissions(result);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error al cargar permisos del rol");
      setSelectedRolePermissions([]);
    } finally {
      setRolePermissionsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const roleGroups: RoleGroup[] = (() => {
    const grouped: Record<number, RoleGroup> = {};
    selectedRolePermissions.forEach((r) => {
      if (!grouped[r.roleId]) {
        grouped[r.roleId] = { roleId: r.roleId, roleName: r.roleName!, permissions: [], recordMap: {} };
      }
      grouped[r.roleId].permissions.push(r.permissionName!);
      grouped[r.roleId].recordMap[r.permissionName!] = r.roleId;
    });
    return Object.values(grouped);
  })();

  const handlePermissionsChange = useCallback(
    async (group: RoleGroup, newPermissions: string[]) => {
      const added = newPermissions.filter((p) => !group.permissions.includes(p));
      const removed = group.permissions.filter((p) => !newPermissions.includes(p));

      if (added.length === 0 && removed.length === 0) return;

      setSavingRoleId(group.roleId);

      try {
        for (const permName of removed) {
          const recordId = group.recordMap[permName];
          await RolePermissionService.delete(recordId);
        }
        for (const permName of added) {
          const permissionId = permissionMap[permName] ?? 0;
          await RolePermissionService.post({
            roleId: group.roleId,
            permissionId,
          });
        }
        await loadRolePermissions(group.roleId);
      } catch (err: any) {
        await loadRolePermissions(group.roleId);
        toast.error(err.response?.data?.message || "Error al actualizar permisos");
      } finally {
        setSavingRoleId(null);
      }
    },
    [permissionMap, loadRolePermissions]
  );

  return {
    loading, error, roleGroups, savingRoleId, handlePermissionsChange, refresh,
    selectedRolePermissions, rolePermissionsLoading, loadRolePermissions,
    roleData, roleCurrentPage, setRoleCurrentPage,
    permData, permCurrentPage, setPermCurrentPage,
  };
};
