import { validateBirthDate } from "@/utils/date.util";
import type { Client, ClientLabels } from "../../domain/client";
import { validatePhoneNumber } from "@/utils/number.util";
import { validateEmail } from "@/utils/email.util";
import { useState, type Dispatch, type SetStateAction } from "react";
import type { ClientModule } from "../../application/create-client-module";

export const useCreateClient = (
    module: ClientModule<Client>, 
    labels: ClientLabels,
    draft: Client | null,
    setDraft: Dispatch<SetStateAction<Client | null>>,
    setFormError: (error: string | null) => void,
    errorMessage: (error: unknown) => string,
    reload: () => void,
    onError: (value: string) => void,
    onSaved: (value: boolean) => void
    ) => {
    const [saving, setSaving] = useState(false);

    const saveDraft = async (avatar: File | null) => {
        if (!draft) return;
        const wasUpdate = draft.id > 0;
        const validationError = validateClient?.(draft);
        if (validationError) {
            setFormError(validationError);
            onError?.(validationError);
            return;
        }
        setSaving(true);
        setFormError(null);
        try {
            const savedClient = await module.save(draft);
            setDraft(savedClient);
            if (avatar && module.uploadAvatar) {
                await module.uploadAvatar(savedClient.id, avatar);
            }
            onSaved?.(wasUpdate);
            //closePanel();
            reload();
        } catch (error) {
            const message = errorMessage(error);
            setFormError(message);
            onError?.(message);
        } finally {
            setSaving(false);
        }
    };

    const validateClient = (client: Client) => {console.log("birhtDate", client.birthDate.trim())
        if (!client.dni.trim()) return labels.entity_id_required;
        if (!client.firstName.trim()) return labels.entity_name_required;
        if (!client.lastName.trim()) return labels.entity_last_name_required;
        if (!client.gender.trim()) return labels.entity_gender_required;
        if (!client.birthDate.trim()) return labels.entity_birth_date_required;
        if (client.birthDate.trim()) {
            const validation = validateBirthDate(new Date(client.birthDate));
            if (!validation.isValid) return validation.message;
        }
        if (client.phone && client.phone.trim() && !validatePhoneNumber(client.phone.trim())) {
            return labels.invalid_phone;
        }
        if (client.email && client.email.trim() && !validateEmail(client.email.trim())) {
            return labels.invalid_email;
        }
        return null;
    }

    return {
        saving,
        saveDraft
    }
}