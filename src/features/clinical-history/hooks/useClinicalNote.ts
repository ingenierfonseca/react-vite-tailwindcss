import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import type { ClinicalNote } from "@/models/clinicalNote.type";
import { ClinicalNoteService } from "@/services/clinical-note/clinicalNote.service";

export const useClinicalNote = (sessionId?: number) => {
    const [notes, setNotes] = useState<ClinicalNote[]>([]);
    const [item, setItem] = useState<ClinicalNote>({
        id: 0,
        clinicalSessionId: sessionId ?? 0,
        doctorId: 0,
        note: "",
        isPrivate: false,
        createdAt: ""
    });
    const [loading, setLoading] = useState(false);
    const [isOpenCreateOrEdit, setIsOpenCreateOrEdit] = useState(false);
    const [isOpenTransitionRight, setIsOpenTransitionRight] = useState(false);

    const load = useCallback(async () => {
        if (!sessionId) return;
        setLoading(true);
        try {
            const data = await ClinicalNoteService.getNotesFromSession(sessionId);
            setNotes(data);
        } catch {
            toast.error("Error al cargar las notas");
        } finally {
            setLoading(false);
        }
    }, [sessionId]);

    const openCreate = (value: boolean) => {
        if (value) {
            setIsOpenCreateOrEdit(true);
            setTimeout(() => setIsOpenTransitionRight(true), 50);
        } else {
            setIsOpenTransitionRight(false);
            setTimeout(() => setIsOpenCreateOrEdit(false), 500);
        }
    };

    const resetItem = () => {
        setItem({
            id: 0,
            clinicalSessionId: sessionId ?? 0,
            doctorId: 0,
            note: "",
            isPrivate: false,
            createdAt: ""
        });
    };

    const editItem = (note: ClinicalNote) => {
        setItem({ ...note });
    };

    const save = async (): Promise<boolean> => {
        let success = false;
        setLoading(true);
        if (!validate()) { setLoading(false); return success; }
        try {
            if (item.id) {
                await ClinicalNoteService.put(item.id, item);
                toast.success("Nota actualizada correctamente");
            } else {
                await ClinicalNoteService.post({ ...item, clinicalSessionId: sessionId ?? 0 });
                toast.success("Nota creada correctamente");
            }
            success = true;
        } catch {
            toast.error("Error al guardar la nota");
        } finally {
            setLoading(false);
        }
        return success;
    };

    function validate() {
        if (!item.note.trim()) { toast.error("La nota es requerida"); return false; }
        if (!item.doctorId) { toast.error("Seleccione un doctor"); return false; }
        return true;
    }

    return {
        notes, item, setItem, loading, setLoading,
        isOpenCreateOrEdit, isOpenTransitionRight,
        openCreate, resetItem, editItem, save, load
    };
};
