import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useFormContext } from "react-hook-form";
import type { SessionPlanFormValues, SurfaceKey, ToothSurfaces } from "../../schemas/session-plan.schema";

const upperJaw = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const lowerJaw = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];
const conditions = ["caries", "restoration", "fracture", "healthy", "up-braces", "down-braces"];

export default function OdontogramStep() {
    const [selectedCondition, setSelectedCondition] = useState(conditions[0]);
    const { watch, setValue } = useFormContext<SessionPlanFormValues>();
    const odontogram = watch("odontogram") ?? [];

    const getToothSurfaces = (toothId: number): ToothSurfaces => {
        const entry = odontogram.find((t) => t.toothId === toothId);
        return entry?.surfaces ?? { center: null, top: null, bottom: null, right: null, left: null };
    };

    const updateSurface = (toothId: number, surface: SurfaceKey) => {
        const current = getToothSurfaces(toothId);
        const isSame = current[surface] === selectedCondition;
        const updatedSurfaces = { ...current, [surface]: isSame ? null : selectedCondition };
        const index = odontogram.findIndex((t) => t.toothId === toothId);
        if (index >= 0) {
            const updated = [...odontogram];
            updated[index] = { toothId, surfaces: updatedSurfaces };
            setValue("odontogram", updated, { shouldDirty: true });
        } else {
            setValue("odontogram", [...odontogram, { toothId, surfaces: updatedSurfaces }], { shouldDirty: true });
        }
    };

    const clearAll = () => {
        const cleared = odontogram.map((t) => ({
            ...t,
            surfaces: { center: null, top: null, bottom: null, right: null, left: null },
        }));
        setValue("odontogram", cleared, { shouldDirty: true });
    };

    const allSurfaces = odontogram.flatMap((t) =>
        Object.values(t.surfaces).filter(Boolean) as string[]
    );
    const conditionCounts = conditions.reduce((acc, c) => {
        acc[c] = allSurfaces.filter((s) => s === c).length;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="w-full min-w-full shrink-0 basis-full p-1">
            <Card className="w-full p-4">
                <p className="text-2xl dark:text-slate-200 mb-4">Odontograma</p>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Selecciona una condición y haz clic en las superficies del diente para marcar el diagnóstico.
                </p>

                <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    {conditions.map((condition) => (
                        <button key={condition} type="button"
                            onClick={() => setSelectedCondition(condition)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg shadow-sm transition-all
                                ${selectedCondition === condition
                                    ? "ring-2 ring-offset-1 ring-slate-600 dark:ring-slate-300 bg-white dark:bg-slate-700"
                                    : "bg-white dark:bg-slate-700 hover:ring-1 hover:ring-slate-400"
                                }`}
                        >
                            <div className="w-4 h-4 rounded" style={{ backgroundColor: getColorForCondition(condition) }} />
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-200 capitalize">{condition}</span>
                            <span className="text-xs text-slate-400 ml-0.5">({conditionCounts[condition]})</span>
                        </button>
                    ))}
                    <button type="button" onClick={clearAll}
                        className="ml-auto text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        Limpiar todo
                    </button>
                </div>

                <div className="text-center">
                    <div className="flex justify-center flex-wrap">
                        {upperJaw.map((id) => (
                            <Tooth key={id} id={id} type={getToothType(id)}
                                surfaces={getToothSurfaces(id)}
                                onClickSurface={(surface) => updateSurface(id, surface)}
                                rotate={true} />
                        ))}
                    </div>
                    <div className="flex justify-center flex-wrap mt-2">
                        {lowerJaw.map((id) => (
                            <Tooth key={id} id={id} type={getToothType(id)}
                                surfaces={getToothSurfaces(id)}
                                onClickSurface={(surface) => updateSurface(id, surface)}
                                rotate={false} />
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );
}

interface ToothProps {
    id: number;
    type: string;
    surfaces: ToothSurfaces;
    onClickSurface: (surface: SurfaceKey) => void;
    rotate: boolean;
}

function Tooth({ id, type, surfaces, onClickSurface, rotate }: ToothProps) {
    const imgFile = `src/assets/tooth-${type}.png`;

    return (
        <div className="flex-1 min-w-15 max-w-20">
            {!rotate && <ToothDiagram surfaces={surfaces} onClickSurface={onClickSurface} />}
            <div className="cursor-pointer">
                <img src={imgFile} className={`w-full ${rotate ? "rotate-180" : ""}`} alt={`tooth-${id}`} />
            </div>
            {rotate && <ToothDiagram surfaces={surfaces} onClickSurface={onClickSurface} />}
            <div className="text-center text-xs text-slate-500 font-medium">{id}</div>
        </div>
    );
}

const surfacesConfig: { key: SurfaceKey; type: "circle" | "path"; props: any }[] = [
    { key: "center", type: "circle", props: { cx: 50, cy: 50, r: 18 } },
    { key: "top", type: "path", props: { d: "M50 10 A40 40 0 0 1 90 50 L70 50 A20 20 0 0 0 50 30 Z" } },
    { key: "right", type: "path", props: { d: "M90 50 A40 40 0 0 1 50 90 L50 70 A20 20 0 0 0 70 50 Z" } },
    { key: "bottom", type: "path", props: { d: "M50 90 A40 40 0 0 1 10 50 L30 50 A20 20 0 0 0 50 70 Z" } },
    { key: "left", type: "path", props: { d: "M10 50 A40 40 0 0 1 50 10 L50 30 A20 20 0 0 0 30 50 Z" } },
];

function ToothDiagram({ surfaces, onClickSurface }: { surfaces: ToothSurfaces; onClickSurface: (s: SurfaceKey) => void }) {
    return (
        <svg className="cursor-pointer" viewBox="0 0 100 100" style={{ transform: "rotate(45deg)" }}>
            {surfacesConfig.map(({ key, type, props }) => {
                const condition = surfaces[key];
                return type === "circle" ? (
                    <circle key={key} {...props}
                        stroke="#555" strokeWidth={3}
                        fill={getColorForCondition(condition)}
                        onClick={() => onClickSurface(key)}
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                ) : (
                    <path key={key} {...props}
                        stroke="#555" strokeWidth={3}
                        fill={getColorForCondition(condition)}
                        onClick={() => onClickSurface(key)}
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                );
            })}
        </svg>
    );
}

function getToothType(id: number) {
    const n = id % 10;
    if (n === 1 || n === 2) return "incisor";
    if (n === 3) return "canine";
    if (n === 4 || n === 5) return "premolar";
    return "molar";
}

function getColorForCondition(condition: string | null) {
    switch (condition) {
        case "caries": return "#ff2f92";
        case "restoration": return "#4caf50";
        case "fracture": return "#f44336";
        case "healthy": return "#2196f3";
        case "up-braces": return "#9c27b0";
        case "down-braces": return "#ff9800";
        default: return "#f3e8c8";
    }
}
