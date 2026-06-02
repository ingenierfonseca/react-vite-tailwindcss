import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { RolePermissionService } from "../../../../services/role-permission/rolePermission.service";
import { PermissionService } from "../../../../services/permission/permission.service";
import type { RolePermission } from "../../../../models/rolePermission.type";
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
  const [records, setRecords] = useState<RolePermission[]>([]);
  const [permissionMap, setPermissionMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [savingRoleId, setSavingRoleId] = useState<number | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [allRecords, allPermissions] = await Promise.all([
        fetchAll(RolePermissionService.get),
        fetchAll(PermissionService.get),
      ]);
      setRecords(allRecords);
      const map: Record<string, number> = {};
      allPermissions.forEach((p) => { map[p.name] = p.id; });
      setPermissionMap(map);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const roleGroups: RoleGroup[] = (() => {
    const grouped: Record<number, RoleGroup> = {};
    records.forEach((r) => {
      if (!grouped[r.roleId]) {
        grouped[r.roleId] = { roleId: r.roleId, roleName: r.roleName, permissions: [], recordMap: {} };
      }
      grouped[r.roleId].permissions.push(r.permissionName);
      grouped[r.roleId].recordMap[r.permissionName] = r.id;
    });
    return Object.values(grouped);
  })();

  const handlePermissionsChange = useCallback(
    async (group: RoleGroup, newPermissions: string[]) => {
      const added = newPermissions.filter((p) => !group.permissions.includes(p));
      const removed = group.permissions.filter((p) => !newPermissions.includes(p));

      if (added.length === 0 && removed.length === 0) return;

      setSavingRoleId(group.roleId);

      setRecords((prev) => {
        let updated = [...prev];
        for (const permName of removed) {
          const recordId = group.recordMap[permName];
          updated = updated.filter((r) => r.id !== recordId);
        }
        for (const permName of added) {
          const [module] = permName.split(".");
          const permissionId = permissionMap[permName] ?? 0;
          updated.push({
            id: -Date.now() - Math.random(),
            roleId: group.roleId,
            roleName: group.roleName,
            permissionId,
            permissionName: permName,
            permissionModule: module,
          });
        }
        return updated;
      });

      try {
        for (const permName of removed) {
          const recordId = group.recordMap[permName];
          await RolePermissionService.delete(recordId);
        }
        for (const permName of added) {
          const [module] = permName.split(".");
          const permissionId = permissionMap[permName] ?? 0;
          await RolePermissionService.post({
            id: 0,
            roleId: group.roleId,
            roleName: group.roleName,
            permissionId,
            permissionName: permName,
            permissionModule: module,
          });
        }
        await refresh();
      } catch (err: any) {
        await refresh();
        toast.error(err.response?.data?.message || "Error al actualizar permisos");
      } finally {
        setSavingRoleId(null);
      }
    },
    [permissionMap, refresh]
  );

  return { loading, error, roleGroups, savingRoleId, handlePermissionsChange, refresh };
};
