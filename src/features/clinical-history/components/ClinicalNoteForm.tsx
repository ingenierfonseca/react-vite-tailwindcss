import { useEffect, useState } from "react";
import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import PageRightComponent from "@/components/commons/PageRightComponent";
import DropDownApp from "@/components/commons/DropDownApp";
import ButtonSaveApp from "@/components/commons/ButtonSaveApp";
import type { ClinicalNote } from "@/models/clinicalNote.type";
import type { DropDownAppModel } from "@/models/dropdownapp.type";
import { DoctorService } from "@/services/doctor/doctor.service";
import { useClinicalNote } from "../hooks/useClinicalNote";

interface ClinicalNoteFormProps {
    sessionId: number;
    itemParam?: ClinicalNote;
    setIsOpen: (value: boolean) => void;
    reload: () => void;
}

export default function ClinicalNoteForm({ sessionId, itemParam, setIsOpen, reload }: ClinicalNoteFormProps) {
    const { item, setItem, loading, save } = useClinicalNote(sessionId);
    const [doctors, setDoctors] = useState<DropDownAppModel[]>([]);

    useEffect(() => {
        if (itemParam) setItem(itemParam);
    }, [itemParam, setItem]);

    useEffect(() => {
        DoctorService.get({ page: 1, search: "" }).then(data => {
            const mapped: DropDownAppModel[] = data.data.map(d => ({
                id: d.id,
                value: `Dr. ${d.firstName} ${d.lastName}`
            }));
            setDoctors(mapped);
        });
    }, []);

    const handleSave = async () => {
        const response = await save();
        if (response) { reload(); setIsOpen(false); }
    };

    return (
        <PageRightComponent
            title={item.id ? "Editar Nota" : "Nueva Nota"}
            onClick={() => setIsOpen(false)}
        >
            <fieldset disabled={loading}>
                <div className="flex flex-col gap-4 pt-3">
                    <DropDownApp
                        title="Doctor"
                        data={doctors}
                        value={item.doctorId}
                        onChange={(value) => setItem({ ...item, doctorId: Number(value) })}
                    />
                    <TextField
                        label="Nota"
                        multiline
                        rows={4}
                        value={item.note}
                        onChange={(e) => setItem({ ...item, note: e.target.value })}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={item.isPrivate}
                                onChange={(e) => setItem({ ...item, isPrivate: e.target.checked })}
                            />
                        }
                        label="Privada"
                    />
                </div>
                <div className="flex justify-center pt-4">
                    <ButtonSaveApp className="flex-6" label="Nota" onClick={handleSave} loading={loading} />
                </div>
            </fieldset>
        </PageRightComponent>
    );
}
