import {AvatarInfoSmall} from "@/components/commons/AvatarInfo"
import type { SessionPlan } from "@/services/treatment-plan/treatmentPlan.type"
import { useEffect } from "react"
import { useClinicalNote } from "../hooks/useClinicalNote"
import ClinicalNoteForm from "./ClinicalNoteForm"
import { Card } from "@/components/ui/card"

export default function NotesTab({ sessionPlan }: { sessionPlan?: SessionPlan }) {
    const {
        notes, item,
        isOpenCreateOrEdit, isOpenTransitionRight, openCreate,
        resetItem, editItem, load
    } = useClinicalNote(sessionPlan?.sessionId)

    useEffect(() => {
        load()
    }, [load])

    return (
        <div className="flex flex-col gap-4">
            <Card className="p-3">
            <div className="flex justify-end mb-3">
                <button
                    onClick={() => { resetItem(); openCreate(true); }}
                    className="bg-primary-dark hover:bg-primary-dark/90 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
                >
                    Agregar Nota
                </button>
            </div>
            <div className="space-y-2">
                {notes.map((note) => (
                    <div key={note.id} className="p-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <AvatarInfoSmall
                            name={`${note.doctor?.title} ${note.doctor?.staff.firstName} ${note.doctor?.staff.lastName}`}
                            title={new Date(note.createdAt).toLocaleString()}
                            avatar={note.doctor?.staff.avatar}
                        />
                        <p className="text-base text-slate-800 dark:text-slate-300">{note.note}</p>
                        <div className="ml-auto">
                            <button
                                className="dark:text-primary-dark cursor-pointer"
                                onClick={() => { editItem(note); openCreate(true); }}
                            >
                                Editar nota
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className={`fixed top-0 right-0 h-full w-full md:w-7/12 bg-white dark:bg-slate-800 shadow-2xl z-50 
                            transform transition-transform duration-500 ease-in-out 
                            ${isOpenTransitionRight ? "translate-x-0" : "translate-x-full"}`}>
                {isOpenCreateOrEdit && (
                    <ClinicalNoteForm
                        sessionId={sessionPlan?.sessionId ?? 0}
                        itemParam={item}
                        setIsOpen={openCreate}
                        reload={load}
                    />
                )}
            </div>
            </Card>
        </div>
    )
}
