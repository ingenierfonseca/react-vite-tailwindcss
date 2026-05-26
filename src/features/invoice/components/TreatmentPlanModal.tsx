import Modal from "../../../components/commons/Modal";
import { PaginatedAutocomplete } from "../../../components/pagination-data/PaginatedAutocomplete";
import { useState } from "react";
import { TreatmentPlanService } from "@/services/treatment-plan/treatmentPlan.service";
import { Checkbox, FormControlLabel, FormGroup, TextField } from "@mui/material";
import type { TreatmentPlan, TreatmentPlanItem } from "@/services/treatment-plan/treatmentPlan.type";
import { formatNumber } from "@/utils/number.util";


interface ThreatmentPlanModalProps {
    modal: {
        isOpen: boolean;
        open: () => void;
        close: () => void;
    };
    onClick: (plan: TreatmentPlan, items: TreatmentPlanItem[]) => void,
}

export default function ThreatmentPlanModal({
    modal, onClick
}: ThreatmentPlanModalProps) {
    const [search, setSearch] = useState('')
    const [treatmentPlan, setTreatmentPlan] = useState<TreatmentPlan>()
    const [selectedItems, setSelectedItems] = useState<TreatmentPlanItem[]>([]);

    return (
        <Modal isOpen={modal.isOpen}
            onClose={() => {
                setSearch("")
                modal.close()
            }}
            title="Seleccione plan de tratamiento"
            textBtnConfirm="Agregar"
            clickBtnConfirm={() => {
                onClick(treatmentPlan!, selectedItems)
                modal.close()
                setSearch("")
                setTreatmentPlan(undefined)
            }}>
            <div className="space-y-4">
                <fieldset className="grid p-2 gap-2 border border-slate-200 dark:border-slate-700">
                    <PaginatedAutocomplete
                        label="Plan de Tratamiento"
                        value={search}
                        onChange={async (value, item) => {
                            setSearch(value)
                            setTreatmentPlan(item!)
                            setSelectedItems(item?.items || [])
                        }}
                        fetchData={TreatmentPlanService.getActive}
                        getValue={(item) => item.id}
                        getLabel={(item) => `${item.title.trim()}-(${item.version})`}
                    />
                    <TextField title="Duracion" value={`${treatmentPlan?.estimatedDurationMonths ?? ''} Meses`} className="md:flex-1 px-2 text-sm" disabled={true} />
                    <FormGroup className="px-2">
                        {treatmentPlan && treatmentPlan.items &&
                            treatmentPlan.items.sort((a, b) => a.order - b.order)
                                .map((item) => (
                                    <FormControlLabel
                                        key={item.id}
                                        label={`${item.order} ${item.name}`}
                                        className="dark:text-slate-400"
                                        control={
                                            <Checkbox className="dark:text-primary-dark!"
                                                defaultValue={item.id}
                                                checked={selectedItems.some(i => i.id === item.id)}
                                            />
                                        }
                                    />
                                ))}
                    </FormGroup>
                    <span className={`flex-1 px-2 text-sm md:text-lg dark:text-slate-200`}>Total: {treatmentPlan?.currency?.symbol} {formatNumber(treatmentPlan?.basePrice ?? 0)}</span>
                </fieldset>
            </div>
        </Modal>
    )
}