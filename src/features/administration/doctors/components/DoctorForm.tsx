import { useEffect } from "react";
import ButtonSaveApp from "../../../../components/commons/ButtonSaveApp";
import PageRightComponent from "../../../../components/commons/PageRightComponent";
import { useDoctor } from "../hooks/useDoctor";
import DropDownApp from "@/components/commons/DropDownApp";
import { PaginatedAutocomplete } from "@/components/pagination-data/PaginatedAutocomplete";
import { StaffService } from "@/services/staff/staff.service";
import { SpecialtyService } from "@/services/specialty/specialty.service";
import { ServiceService } from "@/services/service/service.service";
import { DoctorService } from "@/services/doctor/doctor.service";

const titles: { id: number; value: string }[] = [
    { id: 1, value: "Dr." },
    { id: 2, value: "Dra." }
];

interface DoctorFormProps {
    id: number;
    setIsOpen: (value: boolean) => void;
    reload: () => void;
}

export default function DoctorForm({ id, setIsOpen, reload }: DoctorFormProps) {
    const { item, setItem, loading, save } = useDoctor();

    useEffect(() => {
        if (id)
            DoctorService.find(id).then(setItem)
    }, [id]);

    const handleSave = async () => {
        const response = await save();
        if (response) { reload(); setIsOpen(false); }
    };

    return (
        <PageRightComponent
            title={item.id ? "Editar Doctor" : "Nuevo Doctor"}
            onClick={() => setIsOpen(false)}
        >
            <fieldset disabled={loading}>
                <div className="flex gap-4 pt-3">
                    <PaginatedAutocomplete
                        label="Empleado"
                        value={item.staffId}
                        onChange={(value) => setItem({...item, staffId: value})}
                        fetchData={StaffService.get}
                        getValue={(item) => item.id}
                        getLabel={(item) => `${item.firstName.trim()} ${item.lastName.trim()}`}
                    />
                    <PaginatedAutocomplete
                        label="Area"
                        value={item.serviceId}
                        onChange={(value) => setItem({...item, serviceId: value, specialtyId: 0})}
                        fetchData={ServiceService.get}
                        getValue={(item) => item.id}
                        getLabel={(item) => `${item.name.trim()}`}
                    />
                </div>
                <div className="flex gap-2 pt-3">
                    <PaginatedAutocomplete
                        key={`specialty-${item.serviceId}`}
                        label="Especialidad"
                        value={item.specialtyId}
                        onChange={(value) => setItem({...item, specialtyId: value})}
                        fetchData={async (params) => {
                            return SpecialtyService.get({ ...params, serviceId: item.serviceId || undefined });
                        }}
                        getValue={(item) => item.id}
                        getLabel={(item) => `${item.name.trim()}`}
                    />
                    <DropDownApp title="Titulo"
                        data={titles as any}
                        value={item.title ? titles.find(t => t.value === item.title)?.id ?? "" : ""}
                        onChange={(val) => {
                            let g = titles.find(x => x.id === parseInt(val));
                            setItem({ ...item!, title: g?.value ?? "" });
                        }} />
                </div>
                <div className="flex justify-center">
                    <ButtonSaveApp className="flex-6" label="Doctor" onClick={handleSave} loading={loading} />
                </div>
            </fieldset>
        </PageRightComponent>
    );
}
