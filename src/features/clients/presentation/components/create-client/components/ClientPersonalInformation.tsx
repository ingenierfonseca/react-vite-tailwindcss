import { ClientAvatarField } from "./ClientAvatarField";
import { useClientImagePreview } from "../hooks/useClientImagePreview";
import type { Client, ClientLabels } from "@/features/clients/domain/client";
import { IdCard, LocationEdit, Mail, Phone, User } from "lucide-react";
import { DatePicker } from "@mui/x-date-pickers";
import DropDownApp from "@/components/commons/DropDownApp";
import { AutocompleteBasic } from "@/components/pagination-data/Autocomplete";
import { GeographyService } from "@/services/geography/geography.service";
import TextFieldApp from "@/components/commons/TextFieldApp";
import dayjs from "dayjs";
import { ASSETS_URLS } from "@/config/constants";

const genders = [
  { id: 1, value: "Femenino" },
  { id: 2, value: "Masculino" },
  { id: 3, value: "Otro" },
];

const idTypes = [
  { id: 1, value: "Cédula" },
  { id: 2, value: "Pasaporte" }
];

interface Props {
    client: Client;
    saving: boolean;
    labels: ClientLabels;
    selectedImage: File | null;
    onChange: (data: Partial<Client>) => void;
    onImageChange: (file: File | null) => void;
}

export const ClientPersonalInformation = ({
    client,
    saving,
    labels,
    selectedImage,
    onChange,
    onImageChange
}: Props) => {
    const {previewUrl} = useClientImagePreview(selectedImage);

    const imageSrc = previewUrl ?? (client.avatar && !client.avatar.includes("null") ? `${ASSETS_URLS.avatars}${client.avatar}` : undefined);

    return (
        <fieldset disabled={saving} className="mt-3">
            <div className="flex flex-col gap-3 pt-3 md:flex-row">
                <ClientAvatarField
                    imageSrc={imageSrc}
                    client={client}
                    labels={labels}
                    onImageChange={onImageChange}
                />

                <div className="flex-2 flex flex-col justify-around">
                    <div className="flex flex-col">
                        <span className="mb-1 text-sm text-primary font-medium">{labels.type_id}</span>
                        <DropDownApp
                            title={labels.type_id}
                            data={idTypes}
                            value={idTypes.find((idType) => idType.id === client.idType)?.id ?? ""}
                            onChange={(value) => {
                                const idType = idTypes.find((item) => item.id === Number(value));
                                onChange({ idType: idType?.id ?? 0 });
                            }}
                        />
                    </div>
                    <TextFieldApp
                        label={labels.id}
                        startIcon={<IdCard />}
                        value={client.dni}
                        maxLength={20}
                        isRequired={true}
                        disabled={client.id > 0}
                        onChange={(dni) => onChange({ dni })}
                    />
                    <TextFieldApp
                        label={labels.entity_name}
                        startIcon={<User />}
                        value={client.firstName}
                        maxLength={50}
                        isRequired={true}
                        onChange={(firstName) => onChange({ firstName })}
                    />
                    <TextFieldApp
                        label={labels.entity_last_name}
                        startIcon={<User />}
                        value={client.lastName}
                        maxLength={50}
                        isRequired={true}
                        onChange={(lastName) => onChange({ lastName })}
                    />
                </div>
            </div>

            <p className="mt-6 font-semibold text-black dark:text-white">{labels.additional_contact_information}</p>
            <div className="h-0.5 w-full bg-slate-300" />
            <div className="flex flex-col gap-2 pt-3 md:flex-row">
                <TextFieldApp
                    label={labels.phone}
                    startIcon={<Phone />}
                    value={client.phone}
                    maxLength={15}
                    onChange={(phone) => onChange({ phone })}
                />
                <TextFieldApp
                    label={labels.email_long}
                    startIcon={<Mail />}
                    value={client.email}
                    maxLength={60}
                    onChange={(email) => onChange({ email })}
                />

                <div className="flex-1 flex flex-col">
                    <span className="mb-1 text-sm text-primary font-medium">{labels.birth_date}</span>
                    <DatePicker
                        value={client.birthDate ? dayjs(client.birthDate) : null}
                        onChange={(value) => onChange({ birthDate: value?.format("YYYY-MM-DD") ?? "" })}
                        slotProps={{
                            textField: {
                                size: 'small', // Reduce la altura automáticamente
                            },
                        }}
                    />
                </div>
            </div>
            <div className="flex flex-col gap-2 pt-3 md:flex-row">
                <DropDownApp
                    title={labels.gender}
                    data={genders}
                    value={genders.find((gender) => gender.value === client.gender)?.id ?? ""}
                    onChange={(value) => {
                        const gender = genders.find((item) => item.id === Number(value));
                        onChange({ gender: gender?.value ?? "" });
                    }}
                />
                <AutocompleteBasic
                    label={labels.deparment}
                    value={client ? client.departmentId : undefined}
                    onChange={(value) => {
                        const departmentId = value;
                        onChange({
                            departmentId,
                            cityId: null,
                            cityName: null,
                            locationDataProvided: true,
                        });
                    }
                    }
                    disabled={false}
                    fetchData={GeographyService.getDepartments}
                    getValue={(item) => item.id}
                    getLabel={(item) => `${item.name}`}
                />
                <AutocompleteBasic
                    label={labels.city}
                    value={client ? client.cityId : undefined}
                    onChange={(value) => {
                        onChange({
                            cityId: value,
                            locationDataProvided: true,
                        });
                    }
                    }
                    disabled={false}
                    fetchData={GeographyService.getCities}
                    getValue={(item) => item.id}
                    getLabel={(item) => `${item.name}`}
                />

            </div>
            <div className="flex flex-col gap-2 pt-3 md:flex-row">
                <TextFieldApp
                    label={labels.address}
                    startIcon={<LocationEdit />}
                    maxLength={200}
                    isRequired={true}
                    value={client.address}
                    onChange={(address) => onChange({ address })}
                />
            </div>

        </fieldset>
    );
};