import { Checkbox, FormControlLabel, Typography } from "@mui/material";
import type { Permission } from "../../../../models/permission.type";
import { PermissionAction, PermissionResource } from "../../../../models/permission.enum";

const ACTIONS = [
  { action: PermissionAction.View, label: "Ver" },
  { action: PermissionAction.Create, label: "Crear" },
  { action: PermissionAction.Update, label: "Editar" },
];

interface PermissionGridProps {
  allPermissions?: Permission[];
  permissions: string[];
  onChange: (permissions: string[]) => void;
  disabled?: boolean;
}

export default function PermissionGrid({ allPermissions, permissions, onChange, disabled = false }: PermissionGridProps) {
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

  if (allPermissions) {
    const rows = allPermissions.reduce<{ module: string; resource: string; actions: string[] }[]>((acc, p) => {
      const [resource, action] = p.name.split(".");
      if (!action) return acc;
      const existing = acc.find((r) => r.module === p.module && r.resource === resource);
      if (existing) {
        if (!existing.actions.includes(action)) existing.actions.push(action);
      } else {
        acc.push({ module: p.module, resource, actions: [action] });
      }
      return acc;
    }, []);

    const allSelected = (resource: string, availableActions: string[]) =>
      availableActions.every((a) => hasPermission(resource, a));

    const toggleAll = (resource: string, availableActions: string[]) => {
      if (allSelected(resource, availableActions)) {
        onChange(permissions.filter((p) => !p.startsWith(`${resource}.`)));
      } else {
        const missing = availableActions
          .filter((a) => !hasPermission(resource, a))
          .map((a) => `${resource}.${a}`);
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
            {rows.map(({ module, resource, actions: availableActions }) => (
              <tr
                key={`${module}-${resource}`}
                className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <td className="py-1.5 px-2 text-sm text-slate-600 dark:text-slate-300">
                  <span className="font-medium text-slate-700 dark:text-slate-200">{module}</span>
                  <span className="mx-1 text-slate-400">—</span>
                  <span className="capitalize">{resource}</span>
                </td>
                {ACTIONS.map((action) => {
                  const exists = availableActions.includes(action.action);
                  return (
                    <td key={`${resource}-${action.action}`} className="text-center py-1.5 px-2">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={exists && hasPermission(resource, action.action)}
                            onChange={() => exists && togglePermission(resource, action.action)}
                            size="small"
                            disabled={disabled || !exists}
                          />
                        }
                        label=""
                        sx={{ margin: 0 }}
                      />
                    </td>
                  );
                })}
                <td className="text-center py-1.5 px-2">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={allSelected(resource, availableActions)}
                        indeterminate={
                          !allSelected(resource, availableActions) &&
                          availableActions.some((a) => hasPermission(resource, a))
                        }
                        onChange={() => toggleAll(resource, availableActions)}
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
        {rows.length === 0 && (
          <Typography className="text-slate-500 dark:text-slate-400 text-sm py-4 text-center">
            No hay permisos disponibles.
          </Typography>
        )}
      </div>
    );
  }

  const RESOURCES = [
    { resource: PermissionResource.Appointments, label: "Citas" },
    { resource: PermissionResource.Patients, label: "Pacientes" },
    { resource: PermissionResource.Doctors, label: "Doctores" },
    { resource: PermissionResource.Treatments, label: "Tratamientos" },
    { resource: PermissionResource.TreatmentPlans, label: "Planes de Tratamiento" },
    { resource: PermissionResource.Currencies, label: "Monedas" },
    { resource: PermissionResource.TreatmentCategories, label: "Categorías de Tratamiento" },
    { resource: PermissionResource.ExchangeRates, label: "Tipos de Cambio" },
    { resource: PermissionResource.AppointmentTypes, label: "Tipos de Cita" },
    { resource: PermissionResource.Users, label: "Usuarios" },
    { resource: PermissionResource.RolePermissions, label: "Roles y Permisos" },
    { resource: PermissionResource.Roles, label: "Roles" },
    { resource: PermissionResource.Permissions, label: "Permisos" },
    { resource: PermissionResource.Invoice, label: "Facturación" },
    { resource: PermissionResource.ConsultationHistory, label: "Historial de Consultas" },
  ];

  const allSelectedLegacy = (resource: string) =>
    ACTIONS.every((a) => hasPermission(resource, a.action));

  const toggleAllLegacy = (resource: string) => {
    if (allSelectedLegacy(resource)) {
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
                        checked={allSelectedLegacy(resource.resource)}
                        indeterminate={
                          !allSelectedLegacy(resource.resource) &&
                          ACTIONS.some((a) => hasPermission(resource.resource, a.action))
                        }
                        onChange={() => toggleAllLegacy(resource.resource)}
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
