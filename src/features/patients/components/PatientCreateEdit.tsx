import { useEffect } from "react"
import type { Customer } from "../../../services/customer/customer.type"
import { usePatientCreateEdit } from "../hooks/patient.create.hook"
import TextFieldApp from "../../../components/commons/TextFieldApp"
import ButtonSaveApp from "../../../components/commons/ButtonSaveApp"
import { ASSETS_URLS } from "../../../config/constants"
import dayjs from "dayjs"
import { DatePicker } from "@mui/x-date-pickers"
import DropDownApp from "@/components/commons/DropDownApp"
import { Camera, IdCard, LocationEdit, Mail, Phone, Plus, Upload, User } from "lucide-react"

const genders: { id: number; value: string }[] = [
    { id: 1, value: "Femenino" },
    { id: 2, value: "Masculino" },
    { id: 3, value: "Otro" },
];

interface PatientCreateProps {
    customerParam?: Customer
    setIsOpen: (value: boolean) => void
    reload: () => void
}
export default function PatientCreate({ customerParam, setIsOpen, reload }: PatientCreateProps) {
    const {
        customer,
        setCustomer,
        savePatient,
        uploadAvatar,
        loading,
        selectedImage,
        fileInputRef,
        handleUploadClick,
        handleFileChange
    } = usePatientCreateEdit()

    useEffect(() => {
        if (customerParam) {
            setCustomer(customerParam)
        } else {
            setCustomer({
                id: 0,
                dni: '',
                firstName: '',
                lastName: '',
                birthDate: '',
                phone: '',
                email: '',
                address: '',
                gender: '',
                avatar: ''
            })
        }
    }, [customerParam])

    const handleSave = async () => {
        const response = await savePatient()
        if (response && selectedImage) {
            const responseUpload = await uploadAvatar()
            if (responseUpload) {
                reload()
                setIsOpen(false)
            }
        } else if (response) {
            reload()
            setIsOpen(false)
        }
    }

    return (
        <div className="w-full/2 h-screen py-5 px-4 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex">
                <div className="flex gap-2">
                    <User className="text-primary bg-primary/5 p-1 rounded-lg" size={30} />
                    <div>
                        <p className="font-semibold text-black dark:text-white">{customer && customer.id ? 'Editar Paciente' : 'Nuevo Paciente'}</p>
                        <p className="text-xs">Complete la información para {customer?.id === 0 ? "registrar un nuevo paciente." : "actualizar al paciente."}</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-slate-500 hover:text-red-500 text-2xl ml-auto"
                >
                    &times;
                </button>
            </div>
            <fieldset disabled={loading}>
                <div className="flex gap-3 pt-3">
                    <div className="flex flex-col flex-1 items-center">
                        {!selectedImage && customer?.avatar?.length === 0 ? (
                            <div className="flex flex-col items-center w-full px-5 gap-2 text-slate-400 dark:text-slate-600 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200 cursor-pointer"
                                onClick={handleUploadClick} >
                                <div className="relative bg-primary/5 p-3 rounded-full mt-10 mb-3">
                                    <Camera className="size-8 text-primary" />
                                    <Plus className="absolute bottom-2 right-2 size-4 bg-primary rounded-full text-white border border-white" />
                                </div>
                                <p className="text-sm font-semibold text-black">Foto del paciente</p>
                                <p className="text-xs">PNG, JPG hasta 5MB</p>
                                {/* Input oculto */}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                                <div
                                    className="flex w-full gap-2 justify-center text-xs text-primary border border-primary/20 px-3 py-2 rounded-md mt-4 mb-4"
                                >
                                    <Upload size={16} />
                                    <p>Subir Foto</p>
                                </div>
                            </div>) : (
                            <img
                                src={selectedImage ? URL.createObjectURL(selectedImage) : (customer?.avatar !== undefined && customer?.avatar !== null) ? `${ASSETS_URLS.avatars}/${customer?.avatar}` : './src/assets/landscape-placeholder.svg'}
                                alt={`${customer?.firstName} ${customer?.lastName}`}
                                className="w-full h-60 rounded-lg object-cover border-2 border-primary/20 shadow-sm transition-all group-hover:border-primary"
                            />
                        )}
                    </div>
                    <div className="flex-2">
                        <div className=" flex flex-col gap-3">
                            <div className="flex gap-2">
                                <User className="text-primary" />
                                <p className="font-bold">Información personal</p>
                            </div>
                            <TextFieldApp
                                className="flex-1"
                                label="Identificación"
                                startIcon={<IdCard />}
                                value={customer?.dni}
                                maxLength={20}
                                onChange={(value) => setCustomer({ ...customer!, dni: value })}
                                disabled={customer && customer.id ? true : false}
                            />
                            <TextFieldApp
                                className="flex-1"
                                label="Nombre del Paciente"
                                startIcon={<User />}
                                value={customer?.firstName}
                                maxLength={50}
                                onChange={(value) => setCustomer({ ...customer!, firstName: value })}
                            />
                            <TextFieldApp
                                className="flex-1"
                                label="Apellido del Paciente"
                                startIcon={<User />}
                                value={customer?.lastName}
                                maxLength={50}
                                onChange={(value) => setCustomer({ ...customer!, lastName: value })}
                            />
                        </div>
                    </div>
                </div>
                <div className="h-0.5 w-full bg-slate-300 my-4"/>
                <div className="mb-4">
                    <p className="font-semibold text-black">Datos de contacto adicionales</p>
                </div>
                <div className="flex gap-2 pt-3">
                    <TextFieldApp
                        className="flex-1"
                        label="Telefono"
                        startIcon={<Phone />}
                        value={customer?.phone}
                        maxLength={15}
                        onChange={(value) => setCustomer({ ...customer!, phone: value })}
                    />
                    <TextFieldApp
                        className="flex-1"
                        label="Correo Electronico"
                        startIcon={<Mail />}
                        value={customer?.email}
                        maxLength={60}
                        onChange={(value) => setCustomer({ ...customer!, email: value })}
                    />
                    <DatePicker
                        className="flex-1"
                        label="Fecha de nacimiento"
                        value={dayjs(customer?.birthDate)}
                        onChange={(val) => setCustomer({ ...customer!, birthDate: val ? val.format("YYYY-MM-DD") : "" })}
                    />
                </div>
                <div className="flex gap-2 pt-3">
                    <DropDownApp title="Genero"
                        data={genders as any}
                        value={customer?.gender!}
                        onChange={(val) => {
                            let g = genders.find(x => x.id === parseInt(val));
                            setCustomer({ ...customer!, gender: g?.value ?? "" });
                        }} />
                    <TextFieldApp
                        className="flex-1"
                        label="Direccion"
                        startIcon={<LocationEdit />}
                        maxLength={200}
                        value={customer?.address}
                        onChange={(value) => setCustomer({ ...customer!, address: value })}
                    />
                </div>
                <div className="flex justify-center items-center gap-2">
                    <button className="flex-1 mt-3 px-4 py-2 h-10 bg-slate-50 border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
                        onClick={() => setIsOpen(false)}>Cancelar</button>
                    <ButtonSaveApp
                        className="flex-6"
                        label="Paciente"
                        onClick={() => handleSave()}
                        loading={loading}
                    />
                </div>
            </fieldset>
        </div>
    )
}