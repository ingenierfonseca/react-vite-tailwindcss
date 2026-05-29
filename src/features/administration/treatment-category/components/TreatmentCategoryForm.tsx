import TextFieldApp from "../../../../components/commons/TextFieldApp";
import { useEffect } from "react";
import ButtonSaveApp from "../../../../components/commons/ButtonSaveApp";
import PageRightComponent from "../../../../components/commons/PageRightComponent";
import type { TreatmentCategory } from "../../../../services/types/treatmentCategory.type";
import { useTreatmentCategory } from "../hooks/useTreatmentCategory";

interface TreatmentCategoryFormProps {
    itemParam?: TreatmentCategory;
    setIsOpen: (value: boolean) => void;
    reload: () => void;
}

export default function TreatmentCategoryForm({ itemParam, setIsOpen, reload }: TreatmentCategoryFormProps) {
    const { item, setItem, loading, save } = useTreatmentCategory();

    useEffect(() => {
        if (itemParam) setItem(itemParam);
    }, [itemParam]);

    const handleSave = async () => {
        const response = await save();
        if (response) { reload(); setIsOpen(false); }
    };

    return (
        <PageRightComponent
            title={item.id ? "Editar Categoría" : "Nueva Categoría"}
            onClick={() => setIsOpen(false)}
        >
            <fieldset disabled={loading}>
                <div className="flex flex-col gap-4 pt-3">
                    <TextFieldApp className="flex-3" label="Nombre" value={item.name}
                        maxLength={100} onChange={(value) => setItem({ ...item, name: value })} />
                    <TextFieldApp className="flex-3" label="Descripción" value={item.description}
                        maxLength={200} onChange={(value) => setItem({ ...item, description: value })} />
                </div>
                <div className="flex justify-center">
                    <ButtonSaveApp className="flex-6" label="Categoría" onClick={handleSave} loading={loading} />
                </div>
            </fieldset>
        </PageRightComponent>
    );
}
