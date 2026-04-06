import { CircularProgress, TextField } from "@mui/material"
import { useEffect, useRef, useState, type ChangeEvent } from "react"
import type { Customer } from "../../../services/customer/customer.type"
import { usePatientCreateEdit } from "../hooks/patient.create.hook"
import TextFieldApp from "../../../components/commons/TextFieldApp"
import ButtonSaveApp from "../../../components/commons/ButtonSaveApp"
interface PatientCreateProps {
    customerParam?: Customer
    setIsOpen: (value: boolean) => void
    reload: () => void
}
export default function PatientCreate({ customerParam, setIsOpen, reload }: PatientCreateProps) {
    const { customer, setCustomer, savePatient, loading } = usePatientCreateEdit()
    useEffect(() => {
        if (customerParam) {
            setCustomer(customerParam)
        } else {
            setCustomer({
                id: 0,
                firstName: '',
                lastName: '',
                age: 0,
                phone: '',
                email: '',
                address: '',
                gender: ''
            })
        }
    }, [customerParam])

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
        }
    };

    const handleSave = async () => {
        const response = await savePatient()
        if (response) {
            reload()
            setIsOpen(false)
        }
    }

    return (
        <div className="w-full/2 h-screen py-5 px-4 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex">
                <p className="font-semibold text-black dark:text-white">{customer && customer.id ? 'Editar Paciente' : 'Nuevo Paciente'}</p>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-slate-500 hover:text-red-500 text-2xl ml-auto"
                >
                    &times;
                </button>
            </div>
            <fieldset disabled={loading}>
                <div className="flex gap-2 pt-3">
                    <div className="flex flex-col items-center">
                        <div className="relative group">
                            <img
                                src={selectedImage ? URL.createObjectURL(selectedImage) : customer?.avatar || './src/assets/landscape-placeholder.svg'}
                                alt={`${customer?.firstName} ${customer?.lastName}`}
                                className="w-32 h-32 rounded-lg object-cover border-2 border-primary/20 shadow-sm transition-all group-hover:border-primary"
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
                            className="mt-2 w-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 px-3 py-2 rounded-md hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                        >
                            Subir Foto
                        </button>
                    </div>
                    <div className="flex-2 flex flex-col">
                        <TextFieldApp
                            className="flex-1"
                            label="Nombre del Paciente"
                            value={customer?.firstName}
                            maxLength={50}
                            onChange={(value) => setCustomer({ ...customer!, firstName: value })}
                        />
                        <TextFieldApp
                            className="flex-1"
                            label="Apellido del Paciente"
                            value={customer?.lastName}
                            maxLength={50}
                            onChange={(value) => setCustomer({ ...customer!, lastName: value })}
                        />
                    </div>
                </div>
                <div className="flex gap-2 pt-3">
                    <TextFieldApp
                        className="flex-3"
                        label="Telefono"
                        value={customer?.phone}
                        maxLength={15}
                        onChange={(value) => setCustomer({ ...customer!, phone: value })}
                    />
                    <TextFieldApp
                        className="flex-5"
                        label="Correo Electronico"
                        value={customer?.email}
                        maxLength={60}
                        onChange={(value) => setCustomer({ ...customer!, email: value })}
                    />
                    <TextField
                        className="flex-2"
                        label="Edad"
                        variant="outlined"
                        type="number"
                        value={customer?.age ? customer!.age : ''}
                        slotProps={{
                            htmlInput: {
                                min: 0,
                                max: 120,
                                step: 1,
                            },
                        }}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const val = parseInt(e.target.value, 10);
                            setCustomer({ ...customer!, age: isNaN(val) ? 0 : val });
                        }}
                    />
                </div>
                <div className="flex gap-2 pt-3">
                    <TextFieldApp
                        className="flex-1"
                        label="Direccion"
                        maxLength={200}
                        value={customer?.address}
                        onChange={(value) => setCustomer({ ...customer!, address: value })}
                    />
                </div>
                <div className="flex justify-center">
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