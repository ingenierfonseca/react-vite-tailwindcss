import type { Client } from "../domain/client";
import type { ClientModule } from "./create-client-module";
import { hasClientDetailsChanged } from "./client-changes";
import { validateClient, type ClientValidationMessages } from "./validate-client";

export class ClientValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ClientValidationError";
  }
}

export interface SaveClientResult<TClient extends Client> {
  client: TClient;
  isUpdate: boolean;
  didSave: boolean;
  detailsSaved: boolean;
  avatarFailed: boolean;
  avatarError?: unknown;
}

export async function saveClient<TClient extends Client>(input: {
  module: ClientModule<TClient>;
  draft: TClient;
  original: TClient | null;
  avatar: File | null;
  validationMessages: ClientValidationMessages;
}): Promise<SaveClientResult<TClient>> {
  const { module, draft, original, avatar, validationMessages } = input;
  const isUpdate = original !== null && draft.id > 0;
  const detailsChanged = original === null || draft.id <= 0
    ? true
    : hasClientDetailsChanged(draft, original);
  const shouldUploadAvatar = avatar !== null;
  const uploadAvatar = module.uploadAvatar;

  if (!detailsChanged && !shouldUploadAvatar) {
    return { client: draft, isUpdate, didSave: false, detailsSaved: false, avatarFailed: false };
  }

  if (shouldUploadAvatar && !uploadAvatar) {
    throw new Error(validationMessages.avatarUploadUnavailable);
  }

  if (detailsChanged) {
    const validationError = validateClient(draft, validationMessages);
    if (validationError) throw new ClientValidationError(validationError);
  }

  let savedClient = draft;
  if (detailsChanged) savedClient = await module.save(draft);

  let avatarError: unknown;
  let avatarFailed = false;
  if (avatar && uploadAvatar) {
    try {
      await uploadAvatar(savedClient.id, avatar);
    } catch (error) {
      avatarFailed = true;
      avatarError = error;
    }
  }

  return {
    client: savedClient,
    isUpdate,
    didSave: !avatarFailed,
    detailsSaved: detailsChanged,
    avatarFailed,
    avatarError,
  };
}
