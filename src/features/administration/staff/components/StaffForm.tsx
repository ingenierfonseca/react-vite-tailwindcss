import { Controller } from "react-hook-form";
import { useEffect } from "react";
import TextFieldApp from "@/components/commons/TextFieldApp";
import DropDownApp from "@/components/commons/DropDownApp";
import ButtonSaveApp from "@/components/commons/ButtonSaveApp";
import PageRightComponent from "@/components/commons/PageRightComponent";
import type { DropDownAppModel } from "@/models/dropdownapp.type";
import type { Staff } from "@/models/staff.type";
import { useStaff } from "../hooks/useStaff";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { ASSETS_URLS } from "@/config/constants";
import landscapePlaceholder from "@/assets/landscape-placeholder.svg"

interface StaffFormProps {
    itemParam?: Staff;
    setIsOpen: (value: boolean) => void;
    reload: () => void;
}

const GENDER_OPTIONS: DropDownAppModel[] = [
    { id: "Masculino", value: "Masculino" },
    { id: "Femenino", value: "Femenino" },
];

export default function StaffForm({ itemParam, setIsOpen, reload }: StaffFormProps) {
    const {
        control, handleSubmit, formState: { errors }, reset, loading, save,
        selectedImage, fileInputRef, handleFileChange, handleUploadClick
    } = useStaff(itemParam);

    useEffect(() => {
        if (itemParam) reset(itemParam);
    }, [itemParam, reset]);

    const onSubmit = async () => {
        const success = await save();
        if (success) { reload(); setIsOpen(false); }
    };

    return (
        <PageRightComponent
            title={itemParam?.id ? "Editar Empleado" : "Nuevo Empleado"}
            onClick={() => setIsOpen(false)}
        >
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <fieldset disabled={loading}>
                    <div className="flex gap-3">
                        <div className="flex flex-col items-center">
                            <div className="relative group">
                                <img
                                    src={selectedImage ? URL.createObjectURL(selectedImage) : itemParam?.avatar ? `${ASSETS_URLS.avatars}/${itemParam?.avatar}` : landscapePlaceholder}
                                    alt={`${itemParam?.firstName} ${itemParam?.lastName}`}
                                    className="w-54 h-54 rounded-lg object-cover border-2 border-primary/20 shadow-sm transition-all group-hover:border-primary"
                                />
                                {/* Input oculto */}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>

                            <button
                                onClick={handleUploadClick}
                                type="button"
                                className="mt-2 w-full text-xs font-medium bg-primary/10 dark:bg-primary-dark text-primary border border-primary/20 px-3 py-2 rounded-md hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                            >
                                Subir Foto
                            </button>
                        </div>
                        <div className="flex-1 flex flex-col">
                            <div className="flex gap-4 pt-3">
                                <Controller
                                    name="firstName"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="flex-1 flex flex-col">
                                            <TextFieldApp
                                                className="flex-1"
                                                label="Nombre"
                                                value={field.value ?? ""}
                                                onChange={field.onChange}
                                            />
                                            {errors.firstName && (
                                                <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>
                                            )}
                                        </div>
                                    )}
                                />

                                <Controller
                                    name="lastName"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="flex-1 flex flex-col">
                                            <TextFieldApp
                                                className="flex-1"
                                                label="Apellido"
                                                value={field.value ?? ""}
                                                onChange={field.onChange}
                                            />
                                            {errors.lastName && (
                                                <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>
                                            )}
                                        </div>
                                    )}
                                />
                            </div>
                            <div className="flex gap-4 pt-3">
                                <Controller
                                    name="gender"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="flex-1 flex flex-col">
                                            <DropDownApp
                                                title="Género"
                                                data={GENDER_OPTIONS}
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                            {errors.gender && (
                                                <p className="text-xs text-red-500 mt-1">{errors.gender.message}</p>
                                            )}
                                        </div>
                                    )}
                                />
                                <Controller
                                    name="birthDate"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="flex-1 flex flex-col">
                                            <DatePicker
                                                className="flex-1"
                                                label="Fecha de nacimiento"
                                                value={dayjs(field.value) ?? null}
                                                onChange={(val) => field.onChange(val!.format("YYYY-MM-DD"))}
                                            />
                                            {errors.birthDate && (
                                                <p className="text-xs text-red-500 mt-1">{errors.birthDate.message}</p>
                                            )}
                                        </div>
                                    )}
                                />
                            </div>
                            <div className="flex gap-4 pt-3">
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="flex-1 flex flex-col">
                                            <TextFieldApp
                                                className="flex-1"
                                                label="Email"
                                                value={field.value ?? ""}
                                                onChange={field.onChange}
                                            />
                                            {errors.email && (
                                                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                                            )}
                                        </div>
                                    )}
                                />

                                <Controller
                                    name="phone"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="flex-1 flex flex-col">
                                            <TextFieldApp
                                                className="flex-1"
                                                label="Teléfono"
                                                value={field.value ?? ""}
                                                onChange={field.onChange}
                                            />
                                            {errors.phone && (
                                                <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
                                            )}
                                        </div>
                                    )}
                                />
                            </div>
                            
                            <Controller
                                name="address"
                                control={control}
                                render={({ field }) => (
                                    <div className="flex-1 flex flex-col pt-3">
                                        <TextFieldApp
                                            className="flex-1"
                                            label="Dirección"
                                            value={field.value ?? ""}
                                            onChange={field.onChange}
                                        />
                                        {errors.address && (
                                            <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>
                                        )}
                                    </div>
                                )}
                            />
                        </div>
                    </div>




                    <div className="flex justify-center">
                        <ButtonSaveApp className="flex-6" label="Staff" onClick={handleSubmit(onSubmit)} loading={loading} />
                    </div>
                </fieldset>
            </form>
        </PageRightComponent>
    );
}
