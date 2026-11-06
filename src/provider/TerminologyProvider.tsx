import { useCallback, useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

import { TerminologyContext } from "../core/terminology/context/TerminologyContext";
import { TerminologyService } from "@/core/terminology/services/terminology.service";
import type { Gender, TerminologyLabel } from "@/core/terminology/types/terminology.types";

interface Props {
    children: ReactNode;
    languageCode?: string;
}

const EMPTY_TERMINOLOGY: Record<string, TerminologyLabel> = {};

export function TerminologyProvider({ children, languageCode = "es-NI" }: Props) {
    const {
        data,
        isLoading,
        refetch
    } = useQuery({
        queryKey: ["configuration", "terminology", languageCode],
        queryFn: () => TerminologyService.getTerminologyByLanguage(languageCode),
        staleTime: 1000 * 60 * 30, // 30 minutos
        refetchOnWindowFocus: false
    });

    // Transformamos el array terminologyLabels en un Record/Diccionario para búsqueda O(1)
    const terminology = useMemo(() => {
        if (!data?.terminologyLabels) return EMPTY_TERMINOLOGY;

        return data.terminologyLabels.reduce((acc, item) => {
            acc[item.key] = {
                key:item.key,
                singular: item.singular,
                plural: item.plural,
                // Mapeamos isMale a la estructura de género que maneje tu tipo Gender
                isMale: item.isMale, 
            };
            return acc;
        }, {} as Record<string, TerminologyLabel>);
    }, [data?.terminologyLabels]);

    const getLabel = useCallback(
        (key: string, plural = false): string => {
            const item = terminology[key];

            if (!item) return key;

            return plural ? item.plural : item.singular;
        },
        [terminology]
    );

    const getGender = useCallback(
        (key: string): Gender => {
            return terminology[key]?.isMale ? "masculine" : "feminine";
        },
        [terminology]
    );

    const refresh = useCallback(async (): Promise<void> => {
        await refetch();
    }, [refetch]);

    const contextValue = useMemo(
        () => ({
            terminology,
            locale: data?.locale ?? "es-NI",
            isLoading,
            getLabel,
            getGender,
            refresh
        }),
        [terminology, data?.locale, isLoading, getLabel, getGender, refresh]
    );

    return (
        <TerminologyContext.Provider value={contextValue}>
            {children}
        </TerminologyContext.Provider>
    );
}