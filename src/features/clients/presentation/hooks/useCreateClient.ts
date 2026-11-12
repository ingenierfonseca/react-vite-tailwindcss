import { useState, type Dispatch, type SetStateAction } from "react";
import type { Client } from "../../domain/client";
import type { ClientModule } from "../../application/create-client-module";
import { hasClientDetailsChanged } from "../../application/client-changes";
import { ClientValidationError, saveClient } from "../../application/save-client";
import type { ClientLabels } from "../types";

export const useCreateClient = (
  module: ClientModule<Client>,
  labels: ClientLabels,
  draft: Client | null,
  originalDraft: Client | null,
  setDraft: Dispatch<SetStateAction<Client | null>>,
  setOriginalDraft: Dispatch<SetStateAction<Client | null>>,
  setFormError: (error: string | null) => void,
  errorMessage: (error: unknown) => string,
  reload: () => void,
  onError: (message: string) => void,
  onSaved: (wasUpdate: boolean) => void,
  onComplete: () => void,
) => {
  const [saving, setSaving] = useState(false);
  const detailsChanged = Boolean(
    draft && (!originalDraft || hasClientDetailsChanged(draft, originalDraft)),
  );

  const saveDraft = async (avatar: File | null) => {
    if (!draft) return;

    setSaving(true);
    setFormError(null);
    try {
      const result = await saveClient({
        module,
        draft,
        original: originalDraft,
        avatar,
        validationMessages: {
          idRequired: labels.entity_id_required,
          invalidIdentityCard: labels.invalid_identity_card,
          invalidPassport: labels.invalid_passport,
          firstNameRequired: labels.entity_name_required,
          lastNameRequired: labels.entity_last_name_required,
          genderRequired: labels.entity_gender_required,
          departmentRequired: labels.department_required,
          cityRequired: labels.city_required,
          addressRequired: labels.address_required,
          birthDateRequired: labels.entity_birth_date_required,
          invalidBirthDate: labels.invalid_birth_date,
          invalidPhone: labels.invalid_phone,
          invalidEmail: labels.invalid_email,
          avatarUploadUnavailable: labels.avatar_upload_unavailable,
        },
      });

      setDraft(result.client);
      if (result.detailsSaved) setOriginalDraft({ ...result.client });

      if (result.avatarFailed) {
        const uploadError = errorMessage(result.avatarError);
        const message = result.detailsSaved
          ? labels.details_saved_image_failed(uploadError)
          : uploadError;
        if (result.detailsSaved) reload();
        setFormError(message);
        onError(message);
        return;
      }

      if (!result.didSave) return;
      onSaved(result.isUpdate);
      reload();
      onComplete();
    } catch (error) {
      const message = error instanceof ClientValidationError
        ? error.message
        : errorMessage(error);
      setFormError(message);
      onError(message);
    } finally {
      setSaving(false);
    }
  };

  return { saving, detailsChanged, saveDraft };
};
