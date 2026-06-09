import { Card, CardContent } from "@/components/ui/card"
import type { ClinicalNote } from "@/models/clinicalNote.type"
import { formatDateDDMMYYYY } from "@/utils/date.util"

interface RecentNotesCardProps {
    recentNotes: ClinicalNote[]
}

export default function RecentNotesCard({ recentNotes }: RecentNotesCardProps) {
    return (
        <Card>
            <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium dark:text-slate-200">Notas recientes</h2>
                </div>
                <div className="flex flex-col gap-2">
                    {recentNotes.map((note, index) => (
                        <div key={note.id ?? index} className="flex flex-col gap-2 mt-3">
                            <div className="flex items-center gap-2 text-slate-600">
                                <p>{formatDateDDMMYYYY(note.createdAt)}</p>
                                <p>
                                    {note.doctor?.title}
                                    {note.doctor?.staff.firstName} {note.doctor?.staff.lastName}
                                </p>
                            </div>
                            <p>{note.note}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
