import { Checkbox, FormControlLabel } from "@mui/material";

const RESOURCES = [
  { resource: "doctors", label: "Doctores" },
  { resource: "treatments", label: "Tratamientos" },
  { resource: "treatmentplans", label: "Planes de Tratamiento" },
  { resource: "currencies", label: "Monedas" },
  { resource: "treatmentcategories", label: "Categorías de Tratamiento" },
  { resource: "exchangerates", label: "Tipos de Cambio" },
  { resource: "appointmenttypes", label: "Tipos de Cita" },
  { resource: "users", label: "Usuarios" },
  { resource: "rolepermissions", label: "Roles y Permisos" },
  { resource: "roles", label: "Roles" },
  { resource: "permissions", label: "Permisos" },
];

const ACTIONS = [
  { action: "view", label: "Ver" },
  { action: "create", label: "Crear" },
  { action: "update", label: "Editar" },
];

interface PermissionGridProps {
  permissions: string[];
  onChange: (permissions: string[]) => void;
  disabled?: boolean;
}

export default function PermissionGrid({ permissions, onChange, disabled = false }: PermissionGridProps) {
  const hasPermission = (resource: string, action: string) =>
    permissions.includes(`${resource}.${action}`);

  const togglePermission = (resource: string, action: string) => {
    const key = `${resource}.${action}`;
    if (hasPermission(resource, action)) {
      onChange(permissions.filter((p) => p !== key));
    } else {
      onChange([...permissions, key]);
    }
  };

  const allSelected = (resource: string) =>
    ACTIONS.every((a) => hasPermission(resource, a.action));

  const toggleAll = (resource: string) => {
    if (allSelected(resource)) {
      onChange(permissions.filter((p) => !p.startsWith(`${resource}.`)));
    } else {
      const missing = ACTIONS
        .filter((a) => !hasPermission(resource, a.action))
        .map((a) => `${resource}.${a.action}`);
      onChange([...permissions, ...missing]);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-600">
            <th className="text-left py-2 px-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              Recurso
            </th>
            {ACTIONS.map((action) => (
              <th
                key={action.action}
                className="text-center py-2 px-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                {action.label}
              </th>
            ))}
            <th className="text-center py-2 px-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              Todo
            </th>
          </tr>
        </thead>
        <tbody>
          {RESOURCES.map((resource) => (
            <tr
              key={resource.resource}
              className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              <td className="py-1.5 px-2 text-sm text-slate-600 dark:text-slate-300">
                {resource.label}
              </td>
              {ACTIONS.map((action) => (
                <td key={`${resource.resource}-${action.action}`} className="text-center py-1.5 px-2">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={hasPermission(resource.resource, action.action)}
                        onChange={() => togglePermission(resource.resource, action.action)}
                        size="small"
                        disabled={disabled}
                      />
                    }
                    label=""
                    sx={{ margin: 0 }}
                  />
                </td>
              ))}
              <td className="text-center py-1.5 px-2">
                <FormControlLabel
                  control={
                      <Checkbox
                        checked={allSelected(resource.resource)}
                        indeterminate={
                          !allSelected(resource.resource) &&
                          ACTIONS.some((a) => hasPermission(resource.resource, a.action))
                        }
                        onChange={() => toggleAll(resource.resource)}
                        size="small"
                        disabled={disabled}
                      />
                  }
                  label=""
                  sx={{ margin: 0 }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
