import { Card, CardContent } from "@/components/ui/card"
import type { ClinicalFile } from "@/models/clinicalFile.type"

interface TreatmentEvolutionCardProps {
    images: ClinicalFile[]
}

export default function TreatmentEvolutionCard({ images }: TreatmentEvolutionCardProps) {
    return (
        <Card className="flex-[2_1_900px] min-w-0">
            <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium dark:text-slate-200">Evolución del tratamiento</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {images.map((image) => (
                        <div key={image.id} className="rounded-xl overflow-hidden border">
                            <img
                                src={image.url}
                                alt="evolucion"
                                className="w-full h-32 object-cover"
                            />
                            <div className="p-2 text-xs text-center">Mes {image.description}</div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
