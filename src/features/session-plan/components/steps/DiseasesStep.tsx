import { Card } from "@/components/ui/card";
import { useFormContext } from "react-hook-form";
import type { SessionPlanFormValues, DiseaseEntry } from "../../schemas/session-plan.schema";
import { X } from "lucide-react";

const commonDiseases: DiseaseEntry[] = [
    { id: "caries-dental", name: "Caries dental" },
    { id: "gingivitis", name: "Gingivitis" },
    { id: "periodontitis", name: "Periodontitis" },
    { id: "pulpitis", name: "Pulpitis" },
    { id: "absceso-dental", name: "Absceso dental" },
    { id: "bruxismo", name: "Bruxismo" },
    { id: "halitosis", name: "Halitosis" },
    { id: "maloclusion", name: "Maloclusión" },
    { id: "fluorosis", name: "Fluorosis" },
    { id: "hipoplasia-esmalte", name: "Hipoplasia del esmalte" },
    { id: "sensibilidad-dental", name: "Sensibilidad dental" },
    { id: "erosion-dental", name: "Erosión dental" },
    { id: "candidiasis-oral", name: "Candidiasis oral" },
    { id: "herpes-labial", name: "Herpes labial" },
    { id: "aftas-bucales", name: "Aftas bucales" },
    { id: "leucoplasia", name: "Leucoplasia" },
    { id: "xerostomia", name: "Xerostomía (boca seca)" },
    { id: "pericoronaritis", name: "Pericoronaritis" },
    { id: "recesion-gingival", name: "Recesión gingival" },
    { id: "enfermedad-periodontal", name: "Enfermedad periodontal avanzada" },
];

export default function DiseasesStep() {
    const { watch, setValue } = useFormContext<SessionPlanFormValues>();
    const diseases = watch("diseases") ?? [];

    const toggleDisease = (disease: DiseaseEntry) => {
        const exists = diseases.find((d) => d.id === disease.id);
        if (exists) {
            setValue("diseases", diseases.filter((d) => d.id !== disease.id), { shouldDirty: true });
        } else {
            setValue("diseases", [...diseases, disease], { shouldDirty: true });
        }
    };

    const removeDisease = (id: string) => {
        setValue("diseases", diseases.filter((d) => d.id !== id), { shouldDirty: true });
    };

    return (
        <div className="w-full min-w-full shrink-0 basis-full p-1">
            <Card className="w-full p-4">
                <p className="text-2xl dark:text-slate-200 mb-4">Enfermedades del paciente</p>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Selecciona las enfermedades o condiciones que padece el paciente.
                </p>

                {diseases.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {diseases.map((d) => (
                            <span key={d.id}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm
                                    bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                                {d.name}
                                <button type="button" onClick={() => removeDisease(d.id)}
                                    className="hover:text-red-500 transition-colors">
                                    <X size={14} />
                                </button>
                            </span>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {commonDiseases.map((disease) => {
                        const selected = diseases.some((d) => d.id === disease.id);
                        return (
                            <button key={disease.id} type="button"
                                onClick={() => toggleDisease(disease)}
                                className={`text-left px-3 py-2 rounded-lg text-sm transition-all border
                                    ${selected
                                        ? "bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-600 dark:text-indigo-300"
                                        : "bg-white border-slate-200 text-slate-700 hover:border-slate-400 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300"
                                    }`}
                            >
                                {disease.name}
                            </button>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
}
