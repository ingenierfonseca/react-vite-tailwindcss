import TextFieldApp from "../../../../components/commons/TextFieldApp";
import NumberInputApp from "../../../../components/commons/NumberInputApp";
import { useEffect } from "react";
import ButtonSaveApp from "../../../../components/commons/ButtonSaveApp";
import PageRightComponent from "../../../../components/commons/PageRightComponent";
import type { Doctor } from "../../../../services/doctor/doctor.type";
import { useDoctor } from "../hooks/useDoctor";

interface DoctorFormProps {
    itemParam?: Doctor;
    setIsOpen: (value: boolean) => void;
    reload: () => void;
}

export default function DoctorForm({ itemParam, setIsOpen, reload }: DoctorFormProps) {
    const { item, setItem, loading, save } = useDoctor();

    useEffect(() => {
        if (itemParam) setItem(itemParam);
    }, [itemParam]);

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
                <div className="flex flex-col gap-4 pt-3">
                    <TextFieldApp className="flex-3" label="Nombre" value={item.firstName}
                        maxLength={50} onChange={(value) => setItem({ ...item, firstName: value })} />
                    <TextFieldApp className="flex-3" label="Apellido" value={item.lastName}
                        maxLength={50} onChange={(value) => setItem({ ...item, lastName: value })} />
                    <NumberInputApp className="flex-1" title="Edad" value={item.age}
                        shrink={true} onChange={(value) => setItem({ ...item, age: value })} />
                    <TextFieldApp className="flex-5" label="Especialidad" value={item.specialist}
                        maxLength={100} onChange={(value) => setItem({ ...item, specialist: value })} />
                    <TextFieldApp className="flex-3" label="Teléfono" value={item.phone}
                        maxLength={20} onChange={(value) => setItem({ ...item, phone: value })} />
                </div>
                <div className="flex justify-center">
                    <ButtonSaveApp className="flex-6" label="Doctor" onClick={handleSave} loading={loading} />
                </div>
            </fieldset>
        </PageRightComponent>
    );
}
