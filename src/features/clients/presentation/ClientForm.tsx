import { useState, type FormEvent, type ReactNode } from "react";
import type { Client } from "../domain/client";

export interface ClientFormLabels {
  createTitle: string;
  editTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  save: string;
  saving: string;
  cancel: string;
}

const defaultLabels: ClientFormLabels = {
  createTitle: "Nuevo cliente",
  editTitle: "Editar cliente",
  firstName: "Nombre",
  lastName: "Apellido",
  email: "Correo electrónico",
  phone: "Teléfono",
  address: "Dirección",
  avatar: "Foto de perfil",
  save: "Guardar cliente",
  saving: "Guardando…",
  cancel: "Cancelar",
};

interface ClientFormProps<TClient extends Client> {
  client: TClient;
  labels?: Partial<ClientFormLabels>;
  saving?: boolean;
  error?: string | null;
  enableAvatarUpload?: boolean;
  avatarUrl?: (client: TClient) => string | undefined;
  renderAdditionalFields?: (
    client: TClient,
    patchClient: (patch: Partial<TClient>) => void,
  ) => ReactNode;
  onChange: (patch: Partial<TClient>) => void;
  onSubmit: (avatar: File | null) => Promise<void>;
  onCancel: () => void;
}

export function ClientForm<TClient extends Client>({
  client,
  labels,
  saving = false,
  error,
  enableAvatarUpload = false,
  avatarUrl,
  renderAdditionalFields,
  onChange,
  onSubmit,
  onCancel,
}: ClientFormProps<TClient>) {
  const copy = { ...defaultLabels, ...labels };
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void onSubmit(avatarFile);
  };

  return (
    <form onSubmit={submit} className="flex h-full flex-col bg-white dark:bg-slate-900">
      <header className="flex items-start justify-between border-b border-slate-200 p-5 dark:border-slate-700">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {client.id > 0 ? copy.editTitle : copy.createTitle}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{copy.avatar}</p>
        </div>
        <button type="button" onClick={onCancel} aria-label="Cerrar formulario" className="text-2xl text-slate-500 hover:text-red-500">
          &times;
        </button>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {avatarUrl?.(client) && !avatarFile && (
          <img
            src={avatarUrl(client)}
            alt={`${client.firstName} ${client.lastName}`}
            className="h-28 w-28 rounded-full object-cover"
          />
        )}
        {enableAvatarUpload && (
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="client-avatar">{copy.avatar}</label>
            <input
              id="client-avatar"
              type="file"
              accept="image/*"
              onChange={(event) => setAvatarFile(event.target.files?.[0] ?? null)}
              className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 dark:text-slate-300 dark:file:bg-slate-800"
            />
            {avatarFile && <p className="mt-1 text-xs text-slate-500">{avatarFile.name}</p>}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            {copy.firstName}
            <input
              required
              maxLength={80}
              value={client.firstName}
              onChange={(event) => onChange({ firstName: event.target.value } as Partial<TClient>)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
          </label>
          <label className="block text-sm font-medium">
            {copy.lastName}
            <input
              required
              maxLength={80}
              value={client.lastName}
              onChange={(event) => onChange({ lastName: event.target.value } as Partial<TClient>)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
          </label>
          <label className="block text-sm font-medium">
            {copy.email}
            <input
              type="email"
              maxLength={120}
              value={client.email ?? ""}
              onChange={(event) => onChange({ email: event.target.value } as Partial<TClient>)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
          </label>
          <label className="block text-sm font-medium">
            {copy.phone}
            <input
              type="tel"
              maxLength={30}
              value={client.phone ?? ""}
              onChange={(event) => onChange({ phone: event.target.value } as Partial<TClient>)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
          </label>
        </div>
        <label className="block text-sm font-medium">
          {copy.address}
          <input
            maxLength={240}
            value={client.address ?? ""}
            onChange={(event) => onChange({ address: event.target.value } as Partial<TClient>)}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
          />
        </label>
        {renderAdditionalFields?.(client, onChange)}
        {error && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">{error}</p>}
      </div>

      <footer className="flex justify-end gap-3 border-t border-slate-200 p-5 dark:border-slate-700">
        <button type="button" onClick={onCancel} disabled={saving} className="rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-slate-700">
          {copy.cancel}
        </button>
        <button type="submit" disabled={saving} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
          {saving ? copy.saving : copy.save}
        </button>
      </footer>
    </form>
  );
}
