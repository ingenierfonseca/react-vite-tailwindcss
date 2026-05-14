import type { DropDownAppModel } from "@/models/dropdownapp.type"
import type { Result } from "@/models/result.type"
import { ClinicalSessionService } from "@/services/clinical-session/clinicalSession.service"
import type { ClinicalSession } from "@/services/clinical-session/clinicalSession.type"
import { DoctorService } from "@/services/doctor/doctor.service"
import { SessionPlanService } from "@/services/session-plan/sessionPlan.service"
import type { RequestSessionPlanMaster, SessionPlan, TreatmentPlanItem } from "@/services/treatment-plan/treatmentPlan.type"
import type { Currency } from "@/services/types/currency.type"
import { mapToDropdown } from "@/utils/dropdow.util"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

export const useSessionPlanHook = () => {
    const [session, setSession] = useState<ClinicalSession>({
        id: 0,
        customerId: 0,
        doctorId: 1,
        date: new Date().toISOString().split('T')[0],
        reasonForVisit: "",
        clinicalNotes: "",
    })
    const [plansIds, setPlansIds] = useState<number[]>([])
    const [currency, setCurrency] = useState<Currency>()
    const [doctors, setDoctors] = useState<DropDownAppModel[]>()
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [sessionPlan, setSessionPlan] = useState<SessionPlan>({
        id: 0,
        sessionId: 0,
        name: "",
        status: "Pendiente",
        startDate: new Date().toISOString().split('T')[0],
        endDate: "",
        currencyId: 2,
        totalEstimatedPrice: 0,
        comments: "",
        items: []
    })
    const [items, setItems] = useState<TreatmentPlanItem[]>([]);
    const [step, setStep] = useState(1);
    const [isStartTreatmentPlan, setIsStartTreatmentPlan] = useState(false)

    const addPlanId = (id: number) => {
        setPlansIds(prev => [...prev, id])
    }

    const updateSession = <K extends keyof ClinicalSession>(
        key: K,
        value: ClinicalSession[K]
    ) => {
        setSession(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    const updateSessionPlan = <K extends keyof SessionPlan>(
        key: K,
        value: SessionPlan[K]
    ) => {
        setSession(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await DoctorService.get({ page: 1, search: "" });

                const mapped = mapToDropdown(
                    res.data,
                    (doctor) => doctor.id,
                    (doctor) => doctor.firstName
                );
                setDoctors(mapped)
            } catch (error) {
                console.error("Error cargando doctores:", error);
            }
        };
        fetchDoctors();
    }, [])

    const handleSave = async () => {
        const resultSession = await saveSession()
        if (resultSession.isSuccess) {
            updateSession("id", resultSession.value.id)
            updateSessionPlan("sessionId", resultSession.value.id)
            sessionPlan.sessionId = resultSession.value.id;
            const responseSessionPlan = await saveSessionPlan()
            if (responseSessionPlan) {
                if (isStartTreatmentPlan)
                    setStep(4)
                //reload()
                //setIsOpen(false)
            }
        }
    }

    const saveSession = async (): Promise<Result<ClinicalSession>> => {
        var result: Result<ClinicalSession> = {
            isSuccess: false,
            value: session,
            errorMessage: ""
        }

        try {
            if (session?.id) {
                await ClinicalSessionService.put(session.id, session);
                toast.success("Diagnostico actualizado correctamente");
            } else {
                result = await ClinicalSessionService.post_(session!);
                toast.success("Diagnostico creado correctamente");
            }
        } catch (err: any) {console.log("error", err)
            const errorMessage = err.response?.data?.message || "Error al crear el diagnostico";
            toast.error(errorMessage);
            result.errorMessage = errorMessage;
        } finally {
            return result;
        }
    };

    const saveSessionPlan = async (): Promise<boolean> => {
        var success = false;
        try {
            let requesSessionPlan: RequestSessionPlanMaster = {
                sessionId: session.id,
                name: sessionPlan.name,
                status: sessionPlan.status,
                currencyId: currency?.id!,
                plansIds: plansIds,
                comments: sessionPlan.comments
            };

            if (sessionPlan?.id) {
                await SessionPlanService.put(sessionPlan.id, requesSessionPlan);
                toast.success("Plan de tratamiento actualizado correctamente");
            } else {
                await SessionPlanService.post(requesSessionPlan);
                toast.success("Plan de tratamiento creado correctamente");
            }
            success = true;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Error al crear el plan de tratamiento";
            //setError(errorMessage);
            toast.error(errorMessage);
            success = false;
            throw err;
        } finally {
            //setLoading(false);
            return success;
        }
    }

    return {
        session,
        doctors,
        sessionPlan,
        items,
        isOpenModal,
        step,
        isStartTreatmentPlan,
        updateSession,
        updateSessionPlan,
        setItems,
        setIsOpenModal,
        setStep,
        setSessionPlan,
        addPlanId,
        handleSave,
        setIsStartTreatmentPlan,
        setCurrency
    }
}