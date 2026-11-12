import { ClientAvatarField } from "./ClientAvatarField";
import { useClientImagePreview } from "../hooks/useClientImagePreview";
import { useClientGeography } from "@/features/clients/presentation/hooks/useClientGeography";
import { useEffect, useRef } from "react";
import type { Client } from "@/features/clients/domain/client";
import type { ClientLabels } from "@/features/clients/presentation/types";
import { IdCard, LocationEdit, Mail, Phone, User } from "lucide-react";
import { DatePicker } from "@mui/x-date-pickers";
import DropDownApp from "@/components/commons/DropDownApp";
import { AutocompleteBasic } from "@/components/pagination-data/Autocomplete";
import type { CityCatalogItem, DepartmentCatalogItem } from "@/services/geography/geography.service";
import TextFieldApp from "@/components/commons/TextFieldApp";
import dayjs from "dayjs";
import { ASSETS_URLS } from "@/config/constants";

function formatIdentityCard(value: string): string {
    const compact = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 14);
    const digits = compact.slice(0, 13).replace(/\D/g, "");
    const verifier = compact.slice(13, 14).replace(/[^A-Z]/g, "");
    const municipality = digits.slice(0, 3);
    const birthDate = digits.slice(3, 9);
    const serial = digits.slice(9, 13);

    let formatted = municipality;
    if (birthDate) formatted += `-${birthDate}`;
    if (serial || verifier) formatted += `-${serial}${verifier}`;
    return formatted;
}

function normalizePassport(value: string): string {
    return value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 9);
}

interface Props {
    client: Client;
    saving: boolean;
    labels: ClientLabels;
    selectedImage: File | null;
    onChange: (data: Partial<Client>) => void;
    onImageChange: (file: File | null) => void;
    geography: {
        getDepartments: () => Promise<DepartmentCatalogItem[]>;
        getCities: (departmentId: number) => Promise<CityCatalogItem[]>;
    };
}

export const ClientPersonalInformation = ({
    client,
    saving,
    labels,
    selectedImage,
    onChange,
    onImageChange,
    geography
}: Props) => {
    const {
        departments,
        departmentsLoading,
        cities,
        citiesLoading,
    } = useClientGeography(client.departmentId, geography);
    const previousDepartmentId = useRef(client.departmentId);
    const defaultDepartmentApplied = useRef(client.departmentId != null);
    const defaultCityApplied = useRef(client.cityId != null);

    useEffect(() => {
        if (client.departmentId != null || departmentsLoading || defaultDepartmentApplied.current) return;
        const firstDepartment = departments[0];
        if (!firstDepartment) return;

        defaultDepartmentApplied.current = true;
        onChange({
            departmentId: firstDepartment.id,
            departmentName: firstDepartment.name,
            cityId: null,
            cityName: null,
            locationDataProvided: true,
        });
    }, [client.departmentId, departments, departmentsLoading, onChange]);

    useEffect(() => {
        if (!Object.is(previousDepartmentId.current, client.departmentId)) {
            previousDepartmentId.current = client.departmentId;
            defaultCityApplied.current = false;
        }

        if (client.departmentId == null || citiesLoading) return;
        if (client.cityId != null) {
            defaultCityApplied.current = true;
            return;
        }
        if (defaultCityApplied.current) return;

        const firstCity = cities[0];
        if (!firstCity) return;

        defaultCityApplied.current = true;
        onChange({
            cityId: firstCity.id,
            cityName: firstCity.name,
            locationDataProvided: true,
        });
    }, [client.cityId, client.departmentId, cities, citiesLoading, onChange]);

    const genderOptions = [
        { id: 1, label: labels.gender_female, apiValue: "Femenino" },
        { id: 2, label: labels.gender_male, apiValue: "Masculino" },
        { id: 3, label: labels.gender_other, apiValue: "Otro" },
    ];
    const genderSelectOptions = genderOptions.map(({id, label}) => ({id, value: label}));
    const idTypes = [
        { id: 1, value: labels.identity_card },
        { id: 2, value: labels.passport },
    ];
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
                            startIcon={<IdCard size={18} />}
                            onChange={(value) => {
                                const idType = idTypes.find((item) => item.id === Number(value));
                                const nextIdType = idType?.id ?? 0;
                                onChange({
                                    idType: nextIdType,
                                    dni: nextIdType === 1
                                        ? formatIdentityCard(client.dni)
                                        : normalizePassport(client.dni),
                                });
                            }}
                        />
                    </div>
                    <TextFieldApp
                        label={labels.id}
                        startIcon={<IdCard />}
                        value={client.dni}
                        maxLength={client.idType === 1 ? 16 : 9}
                        isRequired={true}
                        disabled={client.id > 0}
                        onChange={(dni) => onChange({
                            dni: client.idType === 1 ? formatIdentityCard(dni) : dni.slice(0, 9),
                        })}
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
            <div className="grid grid-cols-1 gap-2 pt-3 md:grid-cols-3">
                <TextFieldApp
                    label={labels.phone}
                    startIcon={<Phone />}
                    value={client.phone ?? ""}
                    maxLength={15}
                    onChange={(phone) => onChange({ phone })}
                />
                <TextFieldApp
                    label={labels.email_long}
                    startIcon={<Mail />}
                    value={client.email ?? ""}
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
                                fullWidth: true,
                            },
                        }}
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 gap-2 pt-3 md:grid-cols-3">
                <div className="min-w-0 space-y-1">
                    <label id="client-gender-label" htmlFor="client-gender" className="text-sm text-primary font-medium">
                        {labels.gender}<span aria-hidden="true" className="ml-1 text-red-500">*</span>
                    </label>
                    <DropDownApp
                        id="client-gender"
                        ariaLabelledBy="client-gender-label"
                        title={labels.gender}
                        data={genderSelectOptions}
                        value={genderOptions.find((gender) => gender.apiValue === client.gender)?.id ?? ""}
                        required
                        className="w-full min-w-0"
                        onChange={(value) => {
                            const gender = genderOptions.find((item) => item.id === Number(value));
                            onChange({ gender: gender?.apiValue ?? "" });
                        }}
                    />
                </div>
                <div className="min-w-0 space-y-1">
                    <span id="client-department-label" className="block text-sm text-primary font-medium">
                        {labels.department}<span aria-hidden="true" className="ml-1 text-red-500">*</span>
                    </span>
                    <AutocompleteBasic
                        ariaLabelledBy="client-department-label"
                        options={departments}
                        value={client.departmentId}
                        loading={departmentsLoading}
                        required
                        onChange={(value, department) => {
                            const departmentId = value == null ? null : Number(value);
                            if (departmentId === client.departmentId) return;
                            onChange({
                                departmentId,
                                departmentName: department?.name ?? null,
                                cityId: null,
                                cityName: null,
                                locationDataProvided: true,
                            });
                        }}
                        disabled={departmentsLoading}
                        getValue={(item) => item.id}
                        getLabel={(item) => `${item.name}`}
                    />
                </div>
                <div className="min-w-0 space-y-1">
                    <span id="client-city-label" className="block text-sm text-primary font-medium">
                        {labels.city}<span aria-hidden="true" className="ml-1 text-red-500">*</span>
                    </span>
                    <AutocompleteBasic
                        ariaLabelledBy="client-city-label"
                        options={cities}
                        value={client.cityId}
                        loading={citiesLoading}
                        required
                        onChange={(value, city) => {
                            onChange({
                                cityId: value == null ? null : Number(value),
                                cityName: city?.name ?? null,
                                locationDataProvided: true,
                            });
                        }}
                        disabled={client.departmentId == null || citiesLoading}
                        getValue={(item) => item.id}
                        getLabel={(item) => `${item.name}`}
                    />
                </div>

            </div>
            <div className="flex flex-col gap-2 pt-3 md:flex-row">
                <TextFieldApp
                    label={labels.address}
                    startIcon={<LocationEdit />}
                    maxLength={200}
                    isRequired={true}
                    value={client.address ?? ""}
                    onChange={(address) => onChange({ address })}
                />
            </div>

        </fieldset>
    );
};
