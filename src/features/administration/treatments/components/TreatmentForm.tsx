import TextFieldApp from "../../../../components/commons/TextFieldApp"
import { useEffect } from "react";
import ButtonSaveApp from "../../../../components/commons/ButtonSaveApp";
import PageRightComponent from "../../../../components/commons/PageRightComponent";
import type { Treatment } from "../../../../services/treatment/treatment.type";
import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import { useTreatment } from "../hooks/useTreatment";
import DropDownApp from "../../../../components/commons/DropDownApp";
import type { DropDownAppModel } from "../../../../models/dropdownapp.type";

const moneys: DropDownAppModel[] = [
    {
        id: 1,
        value: 'COR - Peso Nicaraguense'
    },
    {
        id: 2,
        value: 'USD - Dolares'
    }
]

interface TretatmentFormProps {
    treatmentParam?: Treatment
    setIsOpen: (value: boolean) => void
    reload: () => void
}
export default function TreatmentForm({ treatmentParam, setIsOpen, reload }: TretatmentFormProps) {
    const {treatment, setTreatment, loading, saveTreatment} = useTreatment()
    useEffect(() => {
        if (treatmentParam) {
            setTreatment(treatmentParam)
        } else {
            setTreatment({
                id: 0,
                name: '',
                description: '',
                currencyId: 1,
                price: 0,
                isActive: true,
                durationMinutes: 0
            })
        }
    }, [treatmentParam])

    const handleSave = async () => {
        const response = await saveTreatment()
        if (response) {
            reload()
            setIsOpen(false)
        }
    }

    return (
        <PageRightComponent
            title={treatment?.id ? 'Editar Tratamiento' : `Nuevo Tratamiento`}
            onClick={() => setIsOpen(false)}
        >
            <fieldset disabled={loading}>
                <div className="flex flex-col gap-4 pt-3">
                    <TextFieldApp
                        className="flex-3"
                        label="Tratamiento"
                        value={treatment?.name}
                        maxLength={50}
                        onChange={(value) => setTreatment({ ...treatment!, name: value })}
                    />
                    <TextFieldApp
                        className="flex-5"
                        label="Descripcion"
                        value={treatment?.description}
                        maxLength={60}
                        onChange={(value) => setTreatment({ ...treatment!, description: value })}
                    />
                </div>
                <div className="flex gap-4 mt-4">
                    <DropDownApp 
                        title="Moneda" 
                        data={moneys} value={treatment ? treatment.currencyId : 1}
                        onChange={(val) => {
                            const value = parseInt(val, 10);
                            setTreatment({ ...treatment!, currencyId: isNaN(value) ? 0 : value });
                        }} />
                    <TextField
                        className="flex-1"
                        label="Precio"
                        variant="outlined"
                        type="number"
                        value={treatment?.price ? treatment!.price : ''}
                        slotProps={{
                            htmlInput: {
                                min: 0,
                                step: 1,
                            },
                        }}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const val = parseInt(e.target.value, 10);
                            setTreatment({ ...treatment!, price: isNaN(val) ? 0 : val });
                        }}
                    />
                </div>
                <div className="mt-4">
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={treatment?.isActive ?? false}
                                onChange={(e) => setTreatment({...treatment!, isActive: e.target.checked})}
                            />
                        }
                        label="Activo" />
                </div>
                <div className="flex justify-center">
                    <ButtonSaveApp
                        className="flex-6"
                        label="Tratamiento"
                        onClick={() => handleSave()}
                        loading={loading}
                    />
                </div>
            </fieldset>
        </PageRightComponent>
    )
}