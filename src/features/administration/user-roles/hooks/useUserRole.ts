import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import type { AdminUser } from "../../../../models/adminUser.type";
import type { AppRole } from "../../../../models/appRole.type";
import { UserService } from "../../../../services/user/user.service";
import { RoleService } from "../../../../services/role/role.service";
import { UserRoleService } from "../../../../services/user-role/userRole.service";

export const useUserRole = () => {
  const [selectedUserId, setSelectedUserId] = useState<number>(0);
  const [selectedRoleId, setSelectedRoleId] = useState<number>(0);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      UserService.get({ page: 1, search: "", size: 100 }),
      RoleService.get({ page: 1, search: "", size: 50 }),
    ])
      .then(([userRes, roleRes]) => {
        setUsers(userRes.data ?? []);
        setRoles(roleRes.data ?? []);
      })
      .catch(() => {});
  }, []);

  const save = async (): Promise<boolean> => {
    let success = false;
    setLoading(true);
    setError(null);
    if (!validate()) { setLoading(false); return success; }
    try {
      await UserRoleService.post({ userId: selectedUserId, roleId: selectedRoleId });
      toast.success("Rol asignado correctamente");
      success = true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Error al asignar el rol";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
    return success;
  };

  const remove = async (userId: number, roleId: number): Promise<boolean> => {
    try {
      await UserRoleService.delete(userId, roleId);
      toast.success("Rol removido correctamente");
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Error al remover el rol";
      toast.error(errorMessage);
      return false;
    }
  };

  function validate(): boolean {
    if (!selectedUserId) { toast.error("Debe seleccionar un usuario"); return false; }
    if (!selectedRoleId) { toast.error("Debe seleccionar un rol"); return false; }
    return true;
  }

  return {
    loading, error, save, remove,
    selectedUserId, setSelectedUserId,
    selectedRoleId, setSelectedRoleId,
    users, roles,
    resetItem: () => { setSelectedUserId(0); setSelectedRoleId(0); },
  };
};
