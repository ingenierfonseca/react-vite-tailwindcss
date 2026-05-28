import TextFieldApp from "../../../../components/commons/TextFieldApp";
import NumberInputApp from "../../../../components/commons/NumberInputApp";
import { useEffect, useState } from "react";
import ButtonSaveApp from "../../../../components/commons/ButtonSaveApp";
import PageRightComponent from "../../../../components/commons/PageRightComponent";
import DropDownApp from "../../../../components/commons/DropDownApp";
import type { TreatmentPlan } from "../../../../services/treatment-plan/treatmentPlan.type";
import { useTreatmentPlan } from "../hooks/useTreatmentPlan";
import { ArrowUp, ArrowDown, Trash2, Plus } from "lucide-react";
import { TextField } from "@mui/material";

interface TreatmentPlanFormProps {
    itemParam?: TreatmentPlan;
    setIsOpen: (value: boolean) => void;
    reload: () => void;
}

const complexities: { id: number; value: string }[] = [
    { id: 1, value: "Baja" },
    { id: 2, value: "Media" },
    { id: 3, value: "Alta" },
];

const moneys: { id: number; value: string }[] = [
    { id: 1, value: "NIO - Córdoba" },
    { id: 2, value: "USD - Dólar" },
];

export default function TreatmentPlanForm({ itemParam, setIsOpen, reload }: TreatmentPlanFormProps) {
    const { item, setItem, loading, save, addItem, removeItem, moveItemUp, moveItemDown } = useTreatmentPlan();
    const [newItemName, setNewItemName] = useState("");

    useEffect(() => {
        if (itemParam) setItem(itemParam);
    }, [itemParam]);

    const handleSave = async () => {
        const response = await save();
        if (response) { reload(); setIsOpen(false); }
    };

    const handleAddItem = () => {
        if (!newItemName.trim()) return;
        addItem(newItemName);
        setNewItemName("");
    };

    const currencyValue = moneys.find(m => m.id === item.currencyId)?.id ?? 1;
    const complexityValue = complexities.find(c => c.value === item.complexity)?.id ?? 2;

    return (
        <PageRightComponent
            title={item.id ? "Editar Plan de Tratamiento" : "Nuevo Plan de Tratamiento"}
            onClick={() => setIsOpen(false)}
        >
            <fieldset disabled={loading}>
                <div className="flex flex-col gap-4 pt-3">
                    <TextFieldApp className="flex-3" label="Título" value={item.title}
                        maxLength={100} onChange={(value) => setItem({ ...item, title: value })} />
                    <TextFieldApp className="flex-5" label="Descripción" value={item.description}
                        maxLength={200} onChange={(value) => setItem({ ...item, description: value })} />

                    <div className="flex gap-4">
                        <DropDownApp title="Complejidad"
                            data={complexities as any}
                            value={complexityValue}
                            onChange={(val) => {
                                const c = complexities.find(c => c.id === parseInt(val));
                                setItem({ ...item, complexity: c?.value ?? "Media" });
                            }} />
                        <DropDownApp title="Moneda"
                            data={moneys as any}
                            value={currencyValue}
                            onChange={(val) => setItem({ ...item, currencyId: parseInt(val) })} />
                    </div>

                    <div className="flex gap-4">
                        <NumberInputApp className="flex-1" title="Precio Base" value={item.basePrice}
                            shrink={true} onChange={(value) => setItem({ ...item, basePrice: value })} />
                        <NumberInputApp className="flex-1" title="Duración (meses)" value={item.estimatedDurationMonths}
                            shrink={true} min={1} onChange={(value) => setItem({ ...item, estimatedDurationMonths: value })} />
                    </div>

                    <div className="border border-slate-200 dark:border-slate-600 rounded-lg p-4">
                        <p className="text-lg font-semibold dark:text-slate-200 mb-3">Items del Plan</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                            Los items representan los procedimientos incluidos en este plan. Puedes reordenarlos con las flechas.
                        </p>

                        {item.items.length > 0 && (
                            <div className="space-y-2 mb-4">
                                {item.items.map((it, index) => (
                                    <div key={index}
                                        className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                                        <span className="text-xs text-slate-400 w-6 font-mono">{index + 1}.</span>
                                        <span className="flex-1 text-sm dark:text-slate-200">{it.name}</span>
                                        <div className="flex gap-1">
                                            <button type="button" onClick={() => moveItemUp(index)}
                                                disabled={index === 0}
                                                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                                <ArrowUp size={16} className="text-slate-600 dark:text-slate-400" />
                                            </button>
                                            <button type="button" onClick={() => moveItemDown(index)}
                                                disabled={index === item.items.length - 1}
                                                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                                <ArrowDown size={16} className="text-slate-600 dark:text-slate-400" />
                                            </button>
                                            <button type="button" onClick={() => removeItem(index)}
                                                className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                                                <Trash2 size={16} className="text-red-500" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-2">
                            <TextField className="flex-1" label="Nombre del item" variant="outlined" size="small"
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddItem(); } }}
                                slotProps={{
                                    input: {
                                        inputProps: { className: "dark:text-white" }
                                    }
                                }}
                            />
                            <button type="button" onClick={handleAddItem}
                                disabled={!newItemName.trim()}
                                className="flex items-center gap-1 px-3 py-2 bg-primary text-white rounded-md text-sm
                                    hover:bg-primary/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                <Plus size={16} />
                                Agregar
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center">
                    <ButtonSaveApp className="flex-6" label="Plan de Tratamiento" onClick={handleSave} loading={loading} />
                </div>
            </fieldset>
        </PageRightComponent>
    );
}
