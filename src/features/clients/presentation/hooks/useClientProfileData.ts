import { useEffect, useState } from "react";
import type { ClientProfileData } from "../types";

export const useClientProfileData = (
  clientId: number,
  getProfile: (id: number) => Promise<ClientProfileData>,
  fallbackError: string,
  enabled = true,
) => {
  const [result, setResult] = useState<{
    clientId: number;
    profile: ClientProfileData | null;
    error: string | null;
  } | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    getProfile(clientId)
      .then((data) => {
        if (active) setResult({ clientId, profile: data, error: data.error ?? null });
      })
      .catch((reason: unknown) => {
        if (active) {
          setResult({
            clientId,
            profile: null,
            error: reason instanceof Error ? reason.message : fallbackError,
          });
        }
      });

    return () => { active = false; };
  }, [clientId, enabled, fallbackError, getProfile]);

  return {
    risks: enabled && result?.clientId === clientId ? result.profile?.risks ?? [] : [],
    treatmentHistory: enabled && result?.clientId === clientId ? result.profile?.treatmentHistory ?? [] : [],
    consultationHistory: enabled && result?.clientId === clientId ? result.profile?.consultationHistory ?? [] : [],
    loading: enabled && result?.clientId !== clientId,
    error: result?.clientId === clientId ? result.error : null,
  };
};
