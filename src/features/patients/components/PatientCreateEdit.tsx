import { useEffect, useMemo, useRef, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Camera, IdCard, LocationEdit, Mail, Phone, Plus, Upload, User } from "lucide-react";
import ButtonSaveApp from "@/components/commons/ButtonSaveApp";
import DropDownApp from "@/components/commons/DropDownApp";
import TextFieldApp from "@/components/commons/TextFieldApp";
import type { ClientFormRenderProps } from "@/features/clients/presentation/ClientsPage";
import type { Customer } from "@/services/customer/customer.type";

const genders = [
  { id: 1, value: "Femenino" },
  { id: 2, value: "Masculino" },
  { id: 3, value: "Otro" },
];

export default function PatientCreateEdit(props: ClientFormRenderProps<Customer>) {
  const { client, saving, error, avatarUrl, onChange, onSubmit, onCancel } = props;
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrl = useMemo(
    () => selectedImage ? URL.createObjectURL(selectedImage) : null,
    [selectedImage],
  );

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const imageSrc = previewUrl ?? avatarUrl?.(client);

  return (
    <div className="h-screen overflow-y-auto overflow-x-hidden px-4 py-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex">
        <div className="flex gap-2">
          <User className="rounded-lg bg-primary/5 p-1 text-primary" size={30} />
          <div>
            <p className="font-semibold text-black dark:text-white">
              {client.id ? "Editar Paciente" : "Nuevo Paciente"}
            </p>
            <p className="text-xs">
              Complete la información para {client.id ? "actualizar al paciente." : "registrar un nuevo paciente."}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cerrar formulario de paciente"
          className="ml-auto text-2xl text-slate-500 hover:text-red-500"
        >
          &times;
        </button>
      </div>

      <fieldset disabled={saving} className="mt-3">
        <div className="flex flex-col gap-3 pt-3 md:flex-row">
          <div className="flex flex-1 flex-col items-center">
            {imageSrc ? (
              <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full">
                <img
                  src={imageSrc}
                  alt={`${client.firstName} ${client.lastName}`}
                  className="h-60 w-full rounded-lg border-2 border-primary/20 object-cover shadow-sm transition-all hover:border-primary"
                />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 px-5 text-slate-400 dark:bg-slate-900 dark:text-slate-600"
              >
                <span className="relative mb-3 mt-10 rounded-full bg-primary/5 p-3">
                  <Camera className="size-8 text-primary" />
                  <Plus className="absolute bottom-2 right-2 size-4 rounded-full border border-white bg-primary text-white" />
                </span>
                <span className="text-sm font-semibold text-black dark:text-white">Foto del paciente</span>
                <span className="text-xs">PNG, JPG hasta 5MB</span>
                <span className="mb-4 mt-4 flex w-full justify-center gap-2 rounded-md border border-primary/20 px-3 py-2 text-xs text-primary">
                  <Upload size={16} /> Subir Foto
                </span>
              </button>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={(event) => setSelectedImage(event.target.files?.[0] ?? null)}
              className="hidden"
              accept="image/*"
            />
          </div>

          <div className="flex-2">
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <User className="text-primary" />
                <p className="font-bold">Información personal</p>
              </div>
              <TextFieldApp
                className="flex-1"
                label="Identificación"
                startIcon={<IdCard />}
                value={client.dni}
                maxLength={20}
                disabled={client.id > 0}
                onChange={(dni) => onChange({ dni })}
              />
              <TextFieldApp
                className="flex-1"
                label="Nombre del Paciente"
                startIcon={<User />}
                value={client.firstName}
                maxLength={50}
                onChange={(firstName) => onChange({ firstName })}
              />
              <TextFieldApp
                className="flex-1"
                label="Apellido del Paciente"
                startIcon={<User />}
                value={client.lastName}
                maxLength={50}
                onChange={(lastName) => onChange({ lastName })}
              />
            </div>
          </div>
        </div>

        <div className="my-4 h-0.5 w-full bg-slate-300" />
        <p className="mb-4 font-semibold text-black dark:text-white">Datos de contacto adicionales</p>
        <div className="flex flex-col gap-2 pt-3 md:flex-row">
          <TextFieldApp
            className="flex-1"
            label="Teléfono"
            startIcon={<Phone />}
            value={client.phone}
            maxLength={15}
            onChange={(phone) => onChange({ phone })}
          />
          <TextFieldApp
            className="flex-1"
            label="Correo Electrónico"
            startIcon={<Mail />}
            value={client.email}
            maxLength={60}
            onChange={(email) => onChange({ email })}
          />
          <DatePicker
            className="flex-1"
            label="Fecha de nacimiento"
            value={client.birthDate ? dayjs(client.birthDate) : null}
            onChange={(value) => onChange({ birthDate: value?.format("YYYY-MM-DD") ?? "" })}
          />
        </div>
        <div className="flex flex-col gap-2 pt-3 md:flex-row">
          <DropDownApp
            title="Género"
            data={genders}
            value={genders.find((gender) => gender.value === client.gender)?.id ?? ""}
            onChange={(value) => {
              const gender = genders.find((item) => item.id === Number(value));
              onChange({ gender: gender?.value ?? "" });
            }}
          />
          <TextFieldApp
            className="flex-1"
            label="Dirección"
            startIcon={<LocationEdit />}
            maxLength={200}
            value={client.address}
            onChange={(address) => onChange({ address })}
          />
        </div>

        {error && <p role="alert" className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</p>}

        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={onCancel}
            className="mt-3 h-10 flex-1 cursor-pointer rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800"
          >
            Cancelar
          </button>
          <ButtonSaveApp
            className="mt-3 flex-6"
            label="Paciente"
            onClick={() => { void onSubmit(selectedImage); }}
            loading={saving}
          />
        </div>
      </fieldset>
    </div>
  );
}
