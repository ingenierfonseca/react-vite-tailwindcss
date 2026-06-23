import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import type { AdminUser } from "../../../../models/adminUser.type";
import type { AppRole } from "../../../../models/appRole.type";
import { UserService } from "../../../../services/user/user.service";
import { RoleService } from "../../../../services/role/role.service";
import { UserRoleService } from "../../../../services/user-role/userRole.service";

function generateTempPassword(): string {
  return `Temp@${Math.floor(1000 + Math.random() * 9000)}`;
}

export const useUser = () => {
  const [item, setItem] = useState<AdminUser>({
    id: 0, username: "", email: "", roles: [], permissions: [], isActive: true,
  });
  const [password, setPassword] = useState(generateTempPassword);
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    RoleService.get({ page: 1, search: "", size: 50 })
      .then((res) => setRoles(res.data ?? []))
      .catch(() => {});
  }, []);

  const resetPassword = () => setPassword(generateTempPassword());

  const loadUserRoles = async (userId: number) => {
    try {
      const userRoles = await UserRoleService.getByUserId(userId);
      setSelectedRoleIds(userRoles.map((ur) => ur.roleId));
    } catch {
      setSelectedRoleIds([]);
    }
  };

  const save = async (): Promise<boolean> => {
    let success = false;
    setLoading(true);
    setError(null);
    if (!validate()) { setLoading(false); return success; }
    try {
      if (item.id) {
        await UserService.put(item.id, {
          id: item.id,
          username: item.username,
          email: item.email,
          roles: [],
          permissions: item.permissions,
          isActive: item.isActive,
        });

        const existing = await UserRoleService.getByUserId(item.id);
        const existingIds = existing.map((r) => r.roleId);
        const toAdd = selectedRoleIds.filter((id) => !existingIds.includes(id));
        const toRemove = existingIds.filter((id) => !selectedRoleIds.includes(id));

        for (const roleId of toRemove) {
          await UserRoleService.delete(item.id, roleId);
        }
        for (const roleId of toAdd) {
          await UserRoleService.post({ userId: item.id, roleId });
        }

        toast.success("Usuario actualizado correctamente");
      } else {
        const response: any = await UserService.post({
          id: 0,
          username: item.username,
          email: item.email,
          password,
          roles: [],
          permissions: [],
          isActive: true,
        });

        const userId = response?.value?.id ?? response?.id;
        if (!userId) throw new Error("No se pudo obtener el ID del usuario");

        for (const roleId of selectedRoleIds) {
          await UserRoleService.post({ userId, roleId });
        }

        toast.success("Usuario creado correctamente");
      }
      success = true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Error al guardar el usuario";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
    return success;
  };

  function validate(): boolean {
    if (!item.username.trim()) { toast.error("El nombre de usuario es requerido"); return false; }
    if (!item.email.trim()) { toast.error("El email es requerido"); return false; }
    if (!item.id && selectedRoleIds.length === 0) { toast.error("Debe seleccionar al menos un rol"); return false; }
    return true;
  }

  const resetItem = () => {
    setItem({ id: 0, username: "", email: "", roles: [], permissions: [], isActive: true });
    setPassword(generateTempPassword());
    setSelectedRoleIds([]);
  };

  return {
    loading, error, save, item, setItem,
    password, resetPassword, roles,
    selectedRoleIds, setSelectedRoleIds,
    loadUserRoles, resetItem,
  };
};
