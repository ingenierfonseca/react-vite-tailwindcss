import type { DropDownAppModel } from "@/models/dropdownapp.type"
import type { Result } from "@/models/result.type"
import { ClinicalSessionService } from "@/services/clinical-session/clinicalSession.service"
import type { ClinicalSession } from "@/services/clinical-session/clinicalSession.type"
import { DoctorService } from "@/services/doctor/doctor.service"
import type { PaymentTerm } from "@/services/paymentTerm/PaymentTerm.type"
import { SessionPlanService } from "@/services/session-plan/sessionPlan.service"
import type { RequestSessionPlanMaster, SessionPlan, TreatmentPlanItem } from "@/services/treatment-plan/treatmentPlan.type"
import { mapToDropdown } from "@/utils/dropdow.util"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { toast } from "react-toastify"

export const useSessionPlanHook = () => {
    const navigate = useNavigate();
    const [paymentTerm, setPaymentTerm] = useState<PaymentTerm>()
    const [doctors, setDoctors] = useState<DropDownAppModel[]>()
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [items, setItems] = useState<TreatmentPlanItem[]>([]);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false)
    const [session, setSession] = useState<ClinicalSession>({
        id: 0,
        customerId: 0,
        doctorId: 1,
        date: new Date().toISOString().split('T')[0],
        reasonForVisit: "",
        clinicalNotes: "",
    })
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
    const [request, setRequest] = useState<RequestSessionPlanMaster>({
        sessionId: 0,
        name: "",
        status: "Pendiente",
        currencyId: 2,
        paymentTermId: 0,
        isFinanced: false,
        downPayment: 0,
        comments: "",
        plansIds: []
    })

    const addPlanId = (id: number) => {
        setRequest(prev => ({ ...prev, plansIds: [...prev.plansIds, id] }))
    }

    const updateRequestField = <K extends keyof RequestSessionPlanMaster>(
        key: K,
        value: RequestSessionPlanMaster[K]
    ) => {
        setRequest(prev => ({ ...prev, [key]: value }))
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
        if (key === "currencyId")
            setRequest(prev => ({ ...prev, currencyId: value as number }))
        if (key === "name")
            setRequest(prev => ({ ...prev, name: value as string }))
        if (key === "comments")
            setRequest(prev => ({ ...prev, comments: value as string }))
        if (key === "status")
            setRequest(prev => ({ ...prev, status: value as string }))

        setSessionPlan(prev => ({
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
        setLoading(true);
        const resultSession = await saveSession()
        if (resultSession.isSuccess) {
            updateSession("id", resultSession.value.id)
            updateSessionPlan("sessionId", resultSession.value.id)
            sessionPlan.sessionId = resultSession.value.id;
            const responseSessionPlan = await saveSessionPlan(session.id != 0 ? session.id : resultSession.value.id)
            if (responseSessionPlan.isSuccess) {
                navigate(`/patients/${session.customerId}/treatment-history/${responseSessionPlan.value.id}`)
            } else {
                setLoading(false);
            }
        } else {
            setLoading(false);
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
                toast.success("Diagnostico actualizado correctamente");
                result.isSuccess = true;
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

    const saveSessionPlan = async (sessionId: number): Promise<Result<SessionPlan>> => {
        var result: Result<SessionPlan> = {
            isSuccess: false,
            value: sessionPlan,
            errorMessage: ""
        };
        try {
            request.sessionId = sessionId;

            if (sessionPlan?.id) {
                await SessionPlanService.put(sessionPlan.id, request);
                toast.success("Plan de tratamiento actualizado correctamente");
            } else {
                result = await SessionPlanService.post(request);
                toast.success("Plan de tratamiento creado correctamente");
            }
            result.isSuccess = true;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Error al crear el plan de tratamiento";

            toast.error(errorMessage);
            result.errorMessage = errorMessage;
            throw err;
        } finally {
            return result;
        }
    }

    return {
        session,
        doctors,
        sessionPlan,
        items,
        isOpenModal,
        paymentTerm,
        request,
        step,
        loading,
        updateSession,
        updateSessionPlan,
        updateRequestField,
        setItems,
        setIsOpenModal,
        setStep,
        setSessionPlan,
        addPlanId,
        handleSave,
        setPaymentTerm
    }
}