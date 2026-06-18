import { Card } from "@/components/ui/card"
import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Controller, useFormContext } from "react-hook-form";
import type { SessionPlanFormValues } from "../../schemas/session-plan.schema";
import { PaginatedAutocomplete } from "@/components/pagination-data/PaginatedAutocomplete";
import { DoctorService } from "@/services/doctor/doctor.service";
import { ConsultationTypeService } from "@/services/consultation-type/consultationType.service";
import { ServiceService } from "@/services/service/service.service";
import { ClinicalSessionService } from "@/services/clinical-session/clinicalSession.service";

export default function ConsultationStep() {
    const maxLength = 300;
    const { control, watch, setValue } = useFormContext<SessionPlanFormValues>();
    const session = watch("session");

    return (
        <div className="w-full min-w-full shrink-0 basis-full p-1">
            <Card className="w-full p-4">
                <p className="text-2xl dark:text-slate-200 mb-4">Información de la consulta</p>

                <div className="flex flex-col md:flex-row gap-3 mb-4">
                    <Controller
                        control={control}
                        name="session.date"
                        render={({ field }) => (
                            <DatePicker
                                className="flex-1"
                                label="Fecha de la consulta"
                                value={dayjs(session.date)}
                                onChange={(val) => field.onChange(val ? val.toISOString() : "")}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="session.consultationSpecialtyId"
                        render={({ field }) => (
                            <PaginatedAutocomplete
                                label="Especialidad"
                                value={session ? session.consultationSpecialtyId : 0}
                                onChange={(value) => {
                                    field.onChange(value);
                                    setValue("session.doctorId", 0);
                                }}
                                fetchData={ServiceService.get}
                                getValue={(item) => item.id}
                                getLabel={(item) => item.name}
                            />
                        )}
                    />
                </div>
                <div className="flex flex-col md:flex-row gap-3 mb-4">
                    <Controller
                        control={control}
                        name="session.doctorId"
                        render={({ field }) => (
                            <PaginatedAutocomplete
                                key={`doctor-${session.consultationSpecialtyId}`}
                                label="Doctor(a)"
                                value={session ? session.doctorId : 0}
                                onChange={(value) => field.onChange(value)}
                                fetchData={async (params) => {
                                    return DoctorService.get({ ...params, specialtyId: session.consultationSpecialtyId || undefined });
                                }}
                                getValue={(item) => item.id}
                                getLabel={(item) => `${item.firstName} ${item.lastName}`}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="session.consultationTypeId"
                        render={({ field }) => (
                            <PaginatedAutocomplete
                                label="Tipo de consulta"
                                value={session ? session.consultationTypeId : 0}
                                onChange={(value) =>field.onChange(value)}
                                fetchData={ConsultationTypeService.get}
                                getValue={(item) => item.id}
                                getLabel={(item) => item.name}
                            />
                        )}
                    />
                </div>
                {session.consultationTypeId === 2 &&
                    <div className="flex flex-col md:flex-row gap-3 mb-4">
                        <Controller
                            control={control}
                            name="session.consultationId"
                            render={({ field }) => (
                                <PaginatedAutocomplete
                                    label="Consultas del paciente"
                                    value={session ? session.consultationId : 0}
                                    onChange={(value) => field.onChange(value)}
                                    fetchData={(params) => ClinicalSessionService.customerSessionsShortInfo(session.customerId, params)}
                                    getValue={(item) => item.id}
                                    getLabel={(item) => item.consultationNumber}
                                />
                            )}
                        />
                    </div>
                }

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