import DropDownApp from "@/components/commons/DropDownApp"
import { Card } from "@/components/ui/card"
import SelectFile from "@/features/upload-data/components/SelectFile";
import type { DropDownAppModel } from "@/models/dropdownapp.type";
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { ImageIcon } from "lucide-react";

interface file {
    id: number
    name: string,
    preview: string
}

const files: file[] = [
    {
        id: 1,
        name: '',
        preview: 'https://www.odontostore.com/images/blog/como-funcionan-los-aparatos-de-ultrasonidos.jpg'
    }
]
interface DiagnosisStepProps {
    doctors: DropDownAppModel[];
}

export default function DiagnosisStep({ doctors }: DiagnosisStepProps) {
    const maxLength = 300;

    return (
        <div className="w-full min-w-full shrink-0 basis-full p-1">
            <Card className="w-full p-4">
                <p className="text-2xl dark:text-slate-200">Información del diagnóstico</p>
                <div className="flex flex-col md:flex-row gap-3">
                    <DatePicker
                        className="flex-1"
                        label="Fecha del diagnóstico"
                        value={dayjs(Date())}
                    />
                    {doctors && <DropDownApp title="Doctor(a)"
                        data={doctors} value={1}
                        onChange={(value) => {
                            console.log(value)
                        }}
                    />}
                </div>
                <TextField
                    id="outlined-multiline-flexible"
                    label="Motivo de consulta"
                    multiline
                    rows={4}
                    //value={plan.comments ?? ""}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        if (e.target.value.length <= maxLength) {
                            //setValue("plan", { ...plan, comments: e.target.value })
                        }
                    }}
                    //helperText={`${plan.comments.length}/${maxLength}`}
                    slotProps={{
                        input: {
                            inputProps: {
                                maxLength: maxLength,
                            },
                        },
                    }}
                />

                <FormControl>
                    <FormLabel id={`type-diagnostics-label`}>
                        <p className="font-bold">Tipo de diagnostico</p>
                    </FormLabel>
                    <RadioGroup
                        aria-labelledby={`type-diagnostics-label`}
                        defaultValue="female"
                        name="radio-buttons-group"
                    >
                        <FormControlLabel value="female" control={<Radio />} label="Inicial" />
                        <FormControlLabel value="male" control={<Radio />} label="Reevaluacion" />
                        <FormControlLabel value="other" control={<Radio />} label="Postratamiento / Retencion" />
                    </RadioGroup>
                </FormControl>
                <SelectFile onFileSelect={() => { }} />
                <p className="text-lg font-semibold">Imganes o archivos</p>
                <div
                    className="hidden
                        rounded-2xl
                        border-2 border-dashed border-slate-200
                        bg-slate-50
                        p-8
                    "
                >
                    <div className="flex flex-col items-center justify-center py-10">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                            <ImageIcon className="h-8 w-8 text-slate-400" />
                        </div>

                        <h3 className="mt-4 text-base font-semibold text-slate-700">
                            No hay imágenes seleccionadas
                        </h3>

                        <p className="mt-2 max-w-sm text-center text-sm text-slate-500">
                            Selecciona imágenes o documentos para visualizarlos aquí antes de guardar el tratamiento.
                        </p>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    {files.length === 0 ? (
                        <ImageIcon className="h-10 w-10 text-slate-400" />
                    ) : (
                        <div className="flex gap-3 overflow-x-auto">
                            {files.slice(0, 4).map((file) => (
                                <div
                                    key={file.id}
                                    className="
                        relative
                        h-28
                        w-56
                        shrink-0
                        overflow-hidden
                        rounded-xl
                        border
                        border-slate-200
                    "
                                >
                                    <img
                                        src={file.preview}
                                        alt={file.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            ))}

                            {files.length > 4 && (
                                <div
                                    className="
                        flex
                        h-28
                        w-28
                        shrink-0
                        flex-col
                        items-center
                        justify-center
                        rounded-xl
                        bg-slate-100
                        text-slate-600
                    "
                                >
                                    <span className="text-2xl font-bold">
                                        +{files.length - 4}
                                    </span>
                                    <span className="text-xs">
                                        más archivos
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <p>12 archivos . 48.6 MB</p>
            </Card>
        </div>
    )
}