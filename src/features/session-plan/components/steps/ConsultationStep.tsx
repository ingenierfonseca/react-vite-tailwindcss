import { Card } from "@/components/ui/card"
import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Controller, useFormContext } from "react-hook-form";
import type { SessionPlanFormValues } from "../../schemas/session-plan.schema";
import { PaginatedAutocomplete } from "@/components/pagination-data/PaginatedAutocomplete";
import { SpecialtyService } from "@/services/specialty/specialty.service";
import { DoctorService } from "@/services/doctor/doctor.service";
import { ConsultationTypeService } from "@/services/consultation-type/consultationType.service";

export default function ConsultationStep() {
    const maxLength = 300;
    const { control, watch, setValue } = useFormContext<SessionPlanFormValues>();
    const session = watch("session");

    return (
        <div className="w-full min-w-full shrink-0 basis-full p-1">
            <Card className="w-full p-4">
                <p className="text-2xl dark:text-slate-200 mb-4">Información de la consulta</p>

                <div className="flex flex-col md:flex-row gap-3 mb-4">
                    <DatePicker
                        className="flex-1"
                        label="Fecha de la consulta"
                        value={dayjs(session.date)}
                        onChange={(val) => setValue("session.date", val ? val.format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"), { shouldDirty: true })}
                    />
                    <PaginatedAutocomplete
                        label="Especialidad"
                        value={session ? session.specialtyId : undefined}
                        onChange={(value) =>
                            setValue("session.specialtyId", value, { shouldDirty: true })
                        }
                        fetchData={SpecialtyService.get}
                        getValue={(item) => item.id}
                        getLabel={(item) => item.name}
                    />
                </div>
                <div className="flex flex-col md:flex-row gap-3 mb-4">
                    <PaginatedAutocomplete
                        label="Doctor(a)"
                        value={session ? session.doctorId : undefined}
                        onChange={(value) =>
                            setValue("session.doctorId", value, { shouldDirty: true })
                        }
                        fetchData={DoctorService.get}
                        getValue={(item) => item.id}
                        getLabel={(item) => `${item.firstName} ${item.lastName}`}
                    />
                    <PaginatedAutocomplete
                        label="Tipo de consulta"
                        value={session ? session.consultationTypeId : undefined}
                        onChange={(value) =>
                            setValue("session.consultationTypeId", value, { shouldDirty: true })
                        }
                        fetchData={ConsultationTypeService.get}
                        getValue={(item) => item.id}
                        getLabel={(item) => item.name}
                    />
                </div>

                <Controller
                    control={control}
                    name="session.reasonForVisit"
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Motivo de consulta"
                            multiline
                            rows={8}
                            value={session.reasonForVisit}
                            className="mb-4"
                            slotProps={{
                                input: {
                                    inputProps: { maxLength },
                                },
                            }}
                            onChange={(e) => field.onChange(e.target.value)}
                        />
                    )}
                />
            </Card>
        </div>
    )
}