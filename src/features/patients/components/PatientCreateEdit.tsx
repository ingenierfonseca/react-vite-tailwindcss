import { TextField } from "@mui/material"
import { useRef, useState, type ChangeEvent } from "react"
import type { Customer } from "../../../services/customer/customer.type"

interface PatientCreateProps {
    p?: Customer
    setIsOpen: (value: boolean) => void
}
export default function PatientCreate({ p, setIsOpen }: PatientCreateProps) {
    if (!p) {
        p = {
            id: 0,
            firstName: '',
            lastName: '',
            age: 0,
            phone: '',
            email: '',
            address: '',
            gender: ''
        }
    }
    const [patient, setPatient] = useState<Customer>(p)
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
    return (
        <div className="w-full/2 h-screen py-5 px-4 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex">
                <p className="font-semibold text-black dark:text-white">Nuevo Paciente</p>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-slate-500 hover:text-red-500 text-2xl ml-auto"
                >
                    &times;
                </button>
            </div>
            <fieldset>
                <div className="flex gap-2 pt-3">
                    <div className="flex flex-col items-center">
                        <div className="relative group">
                            <img
                                src={selectedImage ? URL.createObjectURL(selectedImage) : patient.avatarUrl || './src/assets/landscape-placeholder.svg'}
                                alt={`${patient.firstName} ${patient.lastName}`}
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
                        <TextField
                            className="flex-1"
                            label="Nombre del Paciente"
                            variant="outlined"
                            value={patient.firstName}
                            onChange={(e) => setPatient({ ...patient, firstName: e.target.value })}
                        />
                        <TextField
                            className="flex-1"
                            label="Apellido del Paciente"
                            variant="outlined"
                            value={patient.lastName}
                            onChange={(e) => setPatient({ ...patient, lastName: e.target.value })}
                        />
                    </div>
                </div>
                <div className="flex gap-2 pt-3">
                    <TextField
                        className="flex-3"
                        label="Telefono"
                        variant="outlined"
                        value={patient.phone}
                        onChange={(e) => setPatient({ ...patient, phone: e.target.value })}
                    />
                    <TextField
                        className="flex-5"
                        label="Correo Electronico"
                        variant="outlined"
                        value={patient.email}
                        onChange={(e) => setPatient({ ...patient, email: e.target.value })}
                    />
                    <TextField
                        className="flex-2"
                        label="Edad"
                        variant="outlined"
                        type="number"
                        value={patient.age ? patient.age : ''}
                        slotProps={{
                            htmlInput: {
                                min: 0,
                                max: 120,
                                step: 1,
                            },
                        }}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const val = parseInt(e.target.value, 10);
                            setPatient({ ...patient, age: isNaN(val) ? 0 : val });
                        }}
                    />
                </div>
                <div className="flex gap-2 pt-3">
                    <TextField
                        className="flex-1"
                        label="Direccion"
                        variant="outlined"
                        value={patient.address}
                        onChange={(e) => setPatient({ ...patient, address: e.target.value })}
                    />
                </div>
                <div className="flex justify-center">
                    <button className="flex-6 mt-4 bg-primary px-4 py-2 font-semibold text-white rounded-sm hover:bg-primary/90 self-end">
                        Guardar Paciente
                    </button>
                </div>
            </fieldset>
        </div>
    )
}