import TextFieldApp from "../../../../components/commons/TextFieldApp";
import { useEffect, useState, useCallback } from "react";
import ButtonSaveApp from "../../../../components/commons/ButtonSaveApp";
import PageRightComponent from "../../../../components/commons/PageRightComponent";
import NumberInputApp from "../../../../components/commons/NumberInputApp";
import DropDownApp from "../../../../components/commons/DropDownApp";
import { Checkbox, FormControlLabel } from "@mui/material";
import type { Resource } from "../../../../models/resource.type";
import type { DropDownAppModel } from "../../../../models/dropdownapp.type";
import { ResourceTypeService } from "../../../../services/resource-type/resourceType.service";
import { useResource } from "../hooks/useResource";

interface ResourceFormProps {
    itemParam?: Resource;
    setIsOpen: (value: boolean) => void;
    reload: () => void;
}

export default function ResourceForm({ itemParam, setIsOpen, reload }: ResourceFormProps) {
    const { item, setItem, loading, save } = useResource();
    const [resourceTypes, setResourceTypes] = useState<DropDownAppModel[]>([]);

    const loadResourceTypes = useCallback(async () => {
        try {
            const res = await ResourceTypeService.get({ page: 1, search: "", size: 100 });
            const items = res.data.map((rt) => ({ id: rt.id, value: rt.name }));
            setResourceTypes(items);
        } catch {
            setResourceTypes([]);
        }
    }, []);

    useEffect(() => {
        loadResourceTypes();
    }, [loadResourceTypes]);

    useEffect(() => {
        if (itemParam) setItem(itemParam);
    }, [itemParam]);

    const handleSave = async () => {
        const response = await save();
        if (response) { reload(); setIsOpen(false); }
    };

    return (
        <PageRightComponent
            title={item.id ? "Editar Recurso" : "Nuevo Recurso"}
            onClick={() => setIsOpen(false)}
        >
            <fieldset disabled={loading}>
                <div className="flex flex-col gap-4 pt-3">
                    <DropDownApp title="Tipo de Recurso" data={resourceTypes}
                        value={item.resourceTypeId}
                        onChange={(val) => setItem({ ...item, resourceTypeId: Number(val) })} />
                    <TextFieldApp className="flex-3" label="Nombre" value={item.name}
                        maxLength={100} onChange={(value) => setItem({ ...item, name: value })} />
                    <TextFieldApp className="flex-3" label="Descripción" value={item.description}
                        maxLength={200} onChange={(value) => setItem({ ...item, description: value })} />
                    <div className="flex gap-4">
                        <NumberInputApp title="Capacidad" value={item.capacity}
                            min={1} shrink
                            onChange={(value) => setItem({ ...item, capacity: value })} />
                        <TextFieldApp className="flex-1" label="Color" value={item.color}
                            maxLength={7} onChange={(value) => setItem({ ...item, color: value })} />
                    </div>
                    <FormControlLabel
                        control={
                            <Checkbox
                                className="dark:text-primary-dark!"
                                checked={item.isActive}
                                onChange={(e) => setItem({ ...item, isActive: e.target.checked })}
                            />
                        }
                        label="Activo" />
                </div>
                <div className="flex justify-center">
                    <ButtonSaveApp className="flex-6" label="Recurso" onClick={handleSave} loading={loading} />
                </div>
            </fieldset>
        </PageRightComponent>
    );
}
