import type { DropDownAppModel } from "@/models/dropdownapp.type"
import { ClinicalSessionService } from "@/services/clinical-session/clinicalSession.service"
import type { ClinicalSession } from "@/services/clinical-session/clinicalSession.type"
import { DoctorService } from "@/services/doctor/doctor.service"
import { SessionPlanService } from "@/services/session-plan/sessionPlan.service"
import type { SessionPlan, TreatmentPlanItem } from "@/services/treatment-plan/treatmentPlan.type"
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
    const [doctors, setDoctors] = useState<DropDownAppModel[]>()
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [sessionPlan, setSessionPlan] = useState<SessionPlan>({
        id: 0,
        sessionId: 0,
        name: "",
        status: "Pendiente",
        startDate: new Date().toISOString().split('T')[0],
        endDate: "",
        totalEstimatedPrice: 0,
        comments: "",
        items: []
    })
    const [items, setItems] = useState<TreatmentPlanItem[]>([]);
    const [step, setStep] = useState(1);
    const [isStartTreatmentPlan, setIsStartTreatmentPlan] = useState(false)

    const updateSession = <K extends keyof ClinicalSession>(
        key: K,
        value: ClinicalSession[K]
    ) => {
        setSessionPlan(prev => ({
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
        //const response = await saveSession()
        //if (response) {
            const responseUpload = await saveSessionPlan()
            if (responseUpload) {
                //reload()
                //setIsOpen(false)
            }
        //}
    }

    const saveSession = async (): Promise<boolean> => {
        var success = false;
        //setLoading(true);
        //setError(null);

        //if (validatePatient() === false) {
            //setLoading(false);
            //return success;
        //}

        try {
            if (session?.id) {
                await ClinicalSessionService.put(session.id, session);
                toast.success("Paciente actualizado correctamente");
            } else {
                await ClinicalSessionService.post(session!);
                toast.success("Paciente creado correctamente");
            }
            success = true;
        } catch (err: any) {console.log("error", err)
            const errorMessage = err.response?.data?.message || "Error al crear el diagnostico";
            //setError(errorMessage);
            toast.error(errorMessage);
            success = false;
            throw err;
        } finally {
            //setLoading(false);
            return success;
        }
    };

    const saveSessionPlan = async (): Promise<boolean> => {
        var success = false;
        try {
            if (sessionPlan?.id) {
                await SessionPlanService.put(sessionPlan.id, sessionPlan);
                toast.success("Paciente actualizado correctamente");
            } else {
                await SessionPlanService.post(sessionPlan!);
                toast.success("Paciente creado correctamente");
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
        handleSave,
        setIsStartTreatmentPlan
    }
}